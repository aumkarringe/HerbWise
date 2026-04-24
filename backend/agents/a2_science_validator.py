# agents/a2_science_validator.py
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

# ── Group-specific validation schemas ────────────────────────────────────────

FULL_SCHEMA = """Return this exact schema:
{
  "condition": "string",
  "validated_herbs": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "known_side_effects": "string",
      "drug_interactions": "string",
      "safe_to_recommend": true
    }
  ],
  "validated_yoga_poses": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "safe_to_recommend": true
    }
  ],
  "validated_acupressure_points": [
    {
      "point_name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "safe_to_recommend": true
    }
  ]
}"""

HERBS_ONLY_SCHEMA = """Return this exact schema:
{
  "condition": "string",
  "validated_herbs": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "known_side_effects": "string",
      "drug_interactions": "string",
      "safety_rating": "very_safe|generally_safe|use_with_caution|avoid",
      "safe_to_recommend": true
    }
  ]
}"""

BREATHING_SCHEMA = """Return this exact schema:
{
  "condition": "string",
  "validated_techniques": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "safe_breath_ratio": "string",
      "safe_to_recommend": true
    }
  ],
  "validated_lung_herbs": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "known_side_effects": "string",
      "safe_to_recommend": true
    }
  ]
}"""

EXERCISE_SCHEMA = """Return this exact schema:
{
  "condition": "string",
  "validated_warmup": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "safe_to_recommend": true
    }
  ],
  "validated_main_sequence": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "safe_to_recommend": true
    }
  ],
  "validated_cooldown": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "safe_to_recommend": true
    }
  ],
  "validated_recovery_herbs": [
    {
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "known_side_effects": "string",
      "safe_to_recommend": true
    }
  ]
}"""

GROUP_SCHEMAS = {
    "full":        FULL_SCHEMA,
    "herbs_only":  HERBS_ONLY_SCHEMA,
    "breathing":   BREATHING_SCHEMA,
    "exercise":    EXERCISE_SCHEMA,
}

BASE_SYSTEM = """You are a biomedical research scientist who validates traditional medicine claims against peer-reviewed evidence.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Be honest — if evidence is weak or none, say so.
- Evidence levels: strong | moderate | weak | none | contradicted

{feature_focus}

{validation_schema}
"""

def _build_items_text(a1_output: dict, group: str) -> str:
    """Build a text summary of A1 items to validate based on group."""
    if group == "full":
        herbs  = "\n".join([f"- {h['name']}: {h.get('traditional_claim','')}"
                            for h in a1_output.get("herbs", [])])
        poses  = "\n".join([f"- {p['name']}: {p.get('traditional_claim','')}"
                            for p in a1_output.get("yoga_poses", [])])
        points = "\n".join([f"- {a['point_name']}: {a.get('traditional_claim','')}"
                            for a in a1_output.get("acupressure_points", [])])
        return f"HERBS:\n{herbs}\n\nYOGA POSES:\n{poses}\n\nACUPRESSURE POINTS:\n{points}"

    elif group == "herbs_only":
        herbs = "\n".join([f"- {h['name']}: {h.get('traditional_claim','')}"
                           for h in a1_output.get("herbs", [])])
        return f"HERBS:\n{herbs}"

    elif group == "breathing":
        techniques = "\n".join([f"- {t['name']} ({t.get('type','')}): {t.get('traditional_benefit','')}"
                                for t in a1_output.get("breathing_techniques", [])])
        breathing_herbs = a1_output.get("lung_herbs", a1_output.get("herbs", []))
        herbs = "\n".join([f"- {h['name']}: {h.get('respiratory_benefit','')}"
                           for h in breathing_herbs])
        return f"BREATHING TECHNIQUES:\n{techniques}\n\nLUNG HERBS:\n{herbs}"

    elif group == "exercise":
        warmup = "\n".join([f"- {p['name']}: {p.get('warmup_purpose','')}"
                            for p in a1_output.get("warmup_poses", [])])
        main   = "\n".join([f"- {p['name']}: {p.get('alignment_cues','')}"
                            for p in a1_output.get("main_sequence_poses", [])])
        cool   = "\n".join([f"- {p['name']}: {p.get('recovery_purpose','')}"
                            for p in a1_output.get("cooldown_poses", [])])
        recovery_herbs = a1_output.get("recovery_herbs", a1_output.get("herbs", []))
        herbs  = "\n".join([f"- {h['name']}: {h.get('recovery_benefit','')}"
                for h in recovery_herbs])
        return (f"WARMUP:\n{warmup}\n\nMAIN SEQUENCE:\n{main}\n\n"
                f"COOLDOWN:\n{cool}\n\nRECOVERY HERBS:\n{herbs}")

    return ""

def run(a1_output: dict, feature_key: str = "wellness_search") -> dict:
    feature   = get_feature_prompt(feature_key)
    group     = get_feature_group(feature_key)
    condition = a1_output["condition"]

    system = BASE_SYSTEM.format(
        feature_focus=feature["a2_focus"],
        validation_schema=GROUP_SCHEMAS.get(group, FULL_SCHEMA)
    )

    print(f"[A2] Feature: {feature_key} | Group: {group} | Validating: {condition}")

    items_text = _build_items_text(a1_output, group)

    user_prompt = f"""Validate the scientific evidence for these remedies for {condition}:

{items_text}

Assign evidence levels and safe_to_recommend for each item."""

    raw     = call_llm(primary="gemini", system=system, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[A2] JSON parse failed: {e}")
        print(f"[A2] Raw response: {raw[:500]}")
        raise ValueError(f"A2 returned invalid JSON: {e}")

    result["condition"]   = condition
    result["feature_key"] = feature_key
    result["group"]       = group
    result["original"]    = a1_output

    # Print summary
    if group == "full":
        for herb in result.get("validated_herbs", []):
            flag = "✓" if herb["safe_to_recommend"] else "✗"
            print(f"  {flag} {herb['name']} — {herb['evidence_level']}")

    elif group == "herbs_only":
        for herb in result.get("validated_herbs", []):
            flag = "✓" if herb["safe_to_recommend"] else "✗"
            print(f"  {flag} {herb['name']} — {herb['evidence_level']}")

    elif group == "breathing":
        for t in result.get("validated_techniques", []):
            flag = "✓" if t["safe_to_recommend"] else "✗"
            print(f"  {flag} {t['name']} — {t['evidence_level']}")

    elif group == "exercise":
        total = (len(result.get("validated_main_sequence", [])) +
                 len(result.get("validated_warmup", [])) +
                 len(result.get("validated_cooldown", [])))
        print(f"  Validated {total} poses + "
              f"{len(result.get('validated_recovery_herbs', []))} recovery herbs")

    return result