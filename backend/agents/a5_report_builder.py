# agents/a5_report_builder.py
import json
import re
from utils.llm_routere import call_llm
from utils.feature_prompts import get_feature_prompt, get_feature_group

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

BASE_SYSTEM = """You are a medical report writer specializing in integrative medicine.

Write a clean, plain-English report a non-medical person can understand and safely follow.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Never recommend anything marked unsafe or unverified.
- Always include safety warnings.
- Be honest about evidence levels.
- Follow the EXACT schema provided — do not add or remove fields.

{feature_focus}

{feature_schema}
"""

def _build_data_summary(a4_output: dict, group: str) -> str:
    """Build a text summary of validated data to pass to A5."""
    original = a4_output.get("original", {})
    citations = "\n".join([
        f"- {c.get('item_name','')}: {c.get('title', c.get('paper_title','N/A'))} "
        f"({c.get('year','')}) — {c.get('url','')}"
        for c in a4_output.get("verified_citations", [])
    ])

    if group == "full":
        safe_herbs = [h for h in a4_output.get("validated_herbs", [])
                      if h.get("safe_to_recommend")]
        safe_poses = [p for p in a4_output.get("verified_poses", [])
                      if p.get("is_safe")]
        safe_points = [a for a in a4_output.get("verified_acupressure_points", [])
                       if a.get("anatomy_accurate")]

        herbs_data = ""
        for h in safe_herbs:
            orig = next((oh for oh in original.get("herbs", [])
                         if oh.get("name") == h["name"]), {})
            herbs_data += (f"\n- {h['name']} [{h['evidence_level']}]"
                           f"\n  Prep: {orig.get('preparation','N/A')}"
                           f"\n  Dosage: {orig.get('dosage','N/A')}"
                           f"\n  Side effects: {h.get('known_side_effects','N/A')}"
                           f"\n  Drug interactions: {h.get('drug_interactions','N/A')}\n")

        poses_data = ""
        for p in safe_poses:
            poses_data += (f"\n- {p['name']} ({p.get('sanskrit_name','N/A')})"
                           f"\n  Alignment: {p.get('alignment_cues','N/A')}"
                           f"\n  Duration: {p.get('verified_duration','N/A')}"
                           f"\n  Modification: {p.get('modification','N/A')}\n")

        points_data = ""
        for a in safe_points:
            points_data += (f"\n- {a['point_name']}"
                            f"\n  Location: {a.get('corrected_location','N/A')}"
                            f"\n  Technique: {a.get('verified_technique','N/A')}"
                            f"\n  Duration: {a.get('verified_duration','N/A')}"
                            f"\n  Frequency: {a.get('frequency','N/A')}\n")

        return (f"SAFE HERBS:\n{herbs_data}\n"
                f"SAFE YOGA POSES:\n{poses_data}\n"
                f"SAFE ACUPRESSURE POINTS:\n{points_data}\n"
                f"SAFETY NOTES:\n{a4_output.get('overall_safety_notes','')}\n"
                f"VERIFIED CITATIONS:\n{citations}")

    elif group == "herbs_only":
        safe_herbs = [h for h in a4_output.get("validated_herbs", [])
                      if h.get("safe_to_recommend")]
        herbs_data = ""
        for h in safe_herbs:
            orig = next((oh for oh in original.get("herbs", [])
                         if oh.get("name") == h["name"]), {})
            herbs_data += (f"\n- {h['name']} [{h['evidence_level']}]"
                           f"\n  Safety rating: {h.get('safety_rating','N/A')}"
                           f"\n  Prep: {orig.get('preparation','N/A')}"
                           f"\n  Dosage: {orig.get('standard_dosage', orig.get('dosage','N/A'))}"
                           f"\n  Side effects: {h.get('known_side_effects','N/A')}"
                           f"\n  Drug interactions: {h.get('drug_interactions','N/A')}\n")

        return (f"SAFE HERBS:\n{herbs_data}\n"
                f"VERIFIED CITATIONS:\n{citations}")

    elif group == "breathing":
        safe_techniques = [t for t in a4_output.get("validated_techniques", [])
                           if t.get("safe_to_recommend")]
        safe_herbs = [h for h in a4_output.get("validated_lung_herbs", [])
                      if h.get("safe_to_recommend")]

        techniques_data = ""
        for t in safe_techniques:
            orig = next((ot for ot in original.get("breathing_techniques", [])
                         if ot.get("name") == t["name"]), {})
            techniques_data += (f"\n- {t['name']} ({orig.get('sanskrit_name','N/A')})"
                                f"\n  Type: {orig.get('type','N/A')}"
                                f"\n  Breath ratio: {orig.get('inhale_count','')}:"
                                f"{orig.get('hold_count','')}:{orig.get('exhale_count','')}"
                                f"\n  Rounds: {orig.get('rounds','N/A')}"
                                f"\n  Best time: {orig.get('best_time','N/A')}"
                                f"\n  Contraindications: {orig.get('contraindications','N/A')}"
                                f"\n  Safe ratio per A2: {t.get('safe_breath_ratio','N/A')}\n")

        herbs_data = ""
        for h in safe_herbs:
            breathing_herbs = original.get("lung_herbs", original.get("herbs", []))
            orig = next((oh for oh in breathing_herbs
                         if oh.get("name") == h["name"]), {})
            herbs_data += (f"\n- {h['name']} [{h['evidence_level']}]"
                           f"\n  Prep: {orig.get('preparation','N/A')}"
                           f"\n  Respiratory benefit: {orig.get('respiratory_benefit','N/A')}\n")

        return (f"VALIDATED BREATHING TECHNIQUES:\n{techniques_data}\n"
                f"LUNG SUPPORT HERBS:\n{herbs_data}\n"
                f"VERIFIED CITATIONS:\n{citations}")

    elif group == "exercise":
        safe_warmup = [p for p in a4_output.get("verified_warmup", [])
                       if p.get("is_safe")]
        safe_main   = [p for p in a4_output.get("verified_main_sequence", [])
                       if p.get("is_safe")]
        safe_cool   = [p for p in a4_output.get("verified_cooldown", [])
                       if p.get("is_safe")]
        safe_herbs  = [h for h in a4_output.get("validated_recovery_herbs", [])
                       if h.get("safe_to_recommend")]

        def pose_text(poses, orig_key):
            text = ""
            for p in poses:
                orig = next((op for op in original.get(orig_key, [])
                             if op.get("name") == p["name"]), {})
                text += (f"\n- {p['name']} ({orig.get('sanskrit_name','N/A')})"
                         f"\n  Duration: {p.get('verified_duration','N/A')}"
                         f"\n  Alignment: {p.get('alignment_cues','N/A')}"
                         f"\n  Beginner: {p.get('beginner_variation', orig.get('beginner_variation','N/A'))}"
                         f"\n  Advanced: {p.get('advanced_variation', orig.get('advanced_variation','N/A'))}\n")
            return text

        herbs_data = ""
        for h in safe_herbs:
            recovery_herbs = original.get("recovery_herbs", original.get("herbs", []))
            orig = next((oh for oh in recovery_herbs
                         if oh.get("name") == h["name"]), {})
            herbs_data += (f"\n- {h['name']} [{h['evidence_level']}]"
                           f"\n  Prep: {orig.get('preparation','N/A')}"
                           f"\n  Recovery benefit: {orig.get('recovery_benefit','N/A')}\n")

        return (f"WARMUP POSES:\n{pose_text(safe_warmup, 'warmup_poses')}\n"
                f"MAIN SEQUENCE:\n{pose_text(safe_main, 'main_sequence_poses')}\n"
                f"COOLDOWN:\n{pose_text(safe_cool, 'cooldown_poses')}\n"
                f"RECOVERY HERBS:\n{herbs_data}\n"
                f"SAFETY NOTES:\n{a4_output.get('sequence_safety_notes','')}\n"
                f"VERIFIED CITATIONS:\n{citations}")

    return ""

def run(a4_output: dict, feature_key: str = "wellness_search") -> dict:
    feature   = get_feature_prompt(feature_key)
    group     = get_feature_group(feature_key)
    condition = a4_output["condition"]

    system = BASE_SYSTEM.format(
        feature_focus=feature["a5_focus"],
        feature_schema=feature["a5_schema"]
    )

    print(f"[A5] Feature: {feature_key} | Group: {group} | Building report for: {condition}")

    data_summary = _build_data_summary(a4_output, group)

    user_prompt = f"""Write a report for: {condition}
Feature: {feature_key}

Use ONLY this validated data:
{data_summary}

Follow the schema EXACTLY. Return only the fields specified in the schema."""

    raw     = call_llm(primary="groq", system=system, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[A5] JSON parse failed: {e}")
        print(f"[A5] Raw response: {raw[:500]}")
        raise ValueError(f"A5 returned invalid JSON: {e}")

    if "report" not in result:
        raise ValueError("[A5] Missing 'report' key")

    result["verified_citations"] = a4_output.get("verified_citations", [])
    result["removed_citations"]  = a4_output.get("removed_citations", [])
    result["feature_key"]        = feature_key
    result["group"]              = group

    # Print summary based on group
    report = result["report"]
    if group == "full":
        print(f"[A5] Report built — "
              f"{len(report.get('herbs',[]))} herbs, "
              f"{len(report.get('yoga_routine',[]))} poses, "
              f"{len(report.get('acupressure_guide',[]))} points")
    elif group == "herbs_only":
        print(f"[A5] Report built — "
              f"{len(report.get('safety_rated_herbs', report.get('dosage_table', report.get('preparation_guides',[]))))} herbs")
    elif group == "breathing":
        print(f"[A5] Report built — "
              f"{len(report.get('breathing_technique_guides',[]))} techniques, "
              f"{len(report.get('herbs',[]))} respiratory herbs")
    elif group == "exercise":
        print(f"[A5] Report built — "
              f"{len(report.get('warmup',[]))} warmup, "
              f"{len(report.get('main_sequence',[]))} main, "
              f"{len(report.get('cooldown',[]))} cooldown")

    return result