# agents/a2_science_validator.py
import json
import re
from utils.llm_routere import call_llm
from utils.feature_prompts import get_feature_prompt

BASE_SYSTEM = """You are a biomedical research scientist who validates traditional medicine claims against peer-reviewed evidence.

You will receive a list of herbs, yoga poses, and acupressure points for a health condition.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Be honest — if evidence is weak or none, say so.
- Evidence levels: strong | moderate | weak | none | contradicted

{feature_focus}

Return this exact schema:
{{
  "condition": "string",
  "validated_herbs": [
    {{
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "known_side_effects": "string",
      "drug_interactions": "string",
      "safe_to_recommend": true
    }}
  ],
  "validated_yoga_poses": [
    {{
      "name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "safe_to_recommend": true
    }}
  ],
  "validated_acupressure_points": [
    {{
      "point_name": "string",
      "evidence_level": "strong|moderate|weak|none|contradicted",
      "evidence_summary": "string",
      "safe_to_recommend": true
    }}
  ]
}}
"""

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

def run(a1_output: dict, feature_key: str = "wellness_search") -> dict:
    feature   = get_feature_prompt(feature_key)
    system    = BASE_SYSTEM.format(feature_focus=feature["a2_focus"])
    condition = a1_output["condition"]

    print(f"[A2] Feature: {feature_key} | Validating: {condition}")

    herbs_list = "\n".join(
        [f"- {h['name']}: {h['traditional_claim']}"
         for h in a1_output["herbs"]]
    )
    poses_list = "\n".join(
        [f"- {p['name']} ({p['sanskrit_name']}): {p['traditional_claim']}"
         for p in a1_output["yoga_poses"]]
    )
    points_list = "\n".join(
        [f"- {a['point_name']} at {a['location_description']}: {a['traditional_claim']}"
         for a in a1_output["acupressure_points"]]
    )

    user_prompt = f"""Validate the scientific evidence for these traditional remedies for {condition}:

HERBS:
{herbs_list}

YOGA POSES:
{poses_list}

ACUPRESSURE POINTS:
{points_list}

For each item assign evidence level and set safe_to_recommend accordingly."""

    raw     = call_llm(primary="gemini", system=system, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[A2] JSON parse failed: {e}")
        print(f"[A2] Raw response: {raw[:500]}")
        raise ValueError(f"A2 returned invalid JSON: {e}")

    required_keys = ["validated_herbs", "validated_yoga_poses", "validated_acupressure_points"]
    for key in required_keys:
        if key not in result:
            raise ValueError(f"[A2] Missing key: {key}")

    result["condition"]   = condition
    result["feature_key"] = feature_key
    result["original"]    = a1_output

    print(f"[A2] Evidence summary:")
    for herb in result["validated_herbs"]:
        flag = "✓" if herb["safe_to_recommend"] else "✗"
        print(f"  {flag} {herb['name']} — {herb['evidence_level']}")

    return result