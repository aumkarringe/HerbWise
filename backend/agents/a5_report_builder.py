# agents/a5_report_builder.py
import json
import re
from utils.llm_routere import call_llm
from utils.feature_prompts import get_feature_prompt

BASE_SYSTEM = """You are a medical report writer specializing in integrative medicine.

Write a clean, plain-English report a non-medical person can understand and safely follow.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Never recommend anything marked unsafe or unverified.
- Always include safety warnings.
- Be honest about evidence levels.

{feature_focus}

Return this exact schema:
{{
  "report": {{
    "condition": "string",
    "bottom_line": "string",
    "herbs": [
      {{
        "name": "string",
        "evidence_level": "string",
        "how_to_use": "string",
        "dosage": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }}
    ],
    "yoga_routine": [
      {{
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time": "string",
        "modification": "string",
        "why_it_helps": "string"
      }}
    ],
    "acupressure_guide": [
      {{
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "how_often": "string",
        "why_it_helps": "string"
      }}
    ],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }}
}}
"""

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

def run(a4_output: dict, feature_key: str = "wellness_search") -> dict:
    feature   = get_feature_prompt(feature_key)
    system    = BASE_SYSTEM.format(feature_focus=feature["a5_focus"])
    condition = a4_output["condition"]

    print(f"[A5] Feature: {feature_key} | Building report for: {condition}")

    safe_herbs  = [h for h in a4_output.get("validated_herbs", []) if h.get("safe_to_recommend")]
    safe_poses  = [p for p in a4_output.get("verified_poses", []) if p.get("is_safe")]
    safe_points = [a for a in a4_output.get("verified_acupressure_points", []) if a.get("anatomy_accurate")]
    original    = a4_output.get("original", {})

    herbs_data = ""
    for h in safe_herbs:
        original_herb = next(
            (oh for oh in original.get("herbs", []) if oh["name"] == h["name"]), {}
        )
        herbs_data += f"""
- {h['name']} [{h['evidence_level']}]
  Preparation: {original_herb.get('preparation', 'N/A')}
  Dosage: {original_herb.get('dosage', 'N/A')}
  Side effects: {h.get('known_side_effects', 'N/A')}
  Drug interactions: {h.get('drug_interactions', 'N/A')}
"""

    poses_data = ""
    for p in safe_poses:
        poses_data += f"""
- {p['name']} ({p.get('sanskrit_name', 'N/A')})
  Alignment: {p.get('alignment_cues', 'N/A')}
  Duration: {p.get('verified_duration', 'N/A')}
  Modification: {p.get('modification', 'N/A')}
"""

    points_data = ""
    for a in safe_points:
        points_data += f"""
- {a['point_name']}
  Location: {a.get('corrected_location', 'N/A')}
  Technique: {a.get('verified_technique', 'N/A')}
  Duration: {a.get('verified_duration', 'N/A')}
  Frequency: {a.get('frequency', 'N/A')}
"""

    citations_data = "\n".join(
        [f"- {c['item_name']}: {c['paper_title']} ({c['year']}) — {c['url']}"
         for c in a4_output.get("verified_citations", [])]
    )

    user_prompt = f"""Write an integrative medicine report for: {condition}

SAFE HERBS:
{herbs_data}

SAFE YOGA POSES:
{poses_data}

SAFE ACUPRESSURE POINTS:
{points_data}

SAFETY NOTES:
{a4_output.get('overall_safety_notes', '')}

VERIFIED CITATIONS:
{citations_data}
"""

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

    print(f"[A5] Report built — "
          f"{len(result['report']['herbs'])} herbs, "
          f"{len(result['report']['yoga_routine'])} poses, "
          f"{len(result['report']['acupressure_guide'])} points")

    return result