# agents/a1_remedy_hunter.py
import json
import re
from utils.llm_routere import call_llm
from utils.feature_prompts import get_feature_prompt

BASE_SYSTEM = """You are a traditional medicine researcher specializing in herbal medicine, yoga therapy, and acupressure.

Your job is to find remedies for a given health condition.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Do not add any text before or after the JSON.
- Follow the exact schema provided.

{feature_focus}

Return this exact schema:
{{
  "condition": "string",
  "herbs": [
    {{
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "traditional_claim": "string"
    }}
  ],
  "yoga_poses": [
    {{
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "traditional_claim": "string"
    }}
  ],
  "acupressure_points": [
    {{
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "traditional_claim": "string"
    }}
  ]
}}

Rules:
- herbs: exactly 5 items
- yoga_poses: 3 to 5 items
- acupressure_points: 3 to 5 items
- Be specific in preparation methods
- Be specific in point locations
"""

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

def run(condition: str, feature_key: str = "wellness_search") -> dict:
    feature = get_feature_prompt(feature_key)
    system  = BASE_SYSTEM.format(feature_focus=feature["a1_focus"])

    print(f"[A1] Feature: {feature_key} | Condition: {condition}")

    # Add condition prefix if feature needs it
    prefix = feature.get("condition_prefix", "")
    full_condition = f"{prefix} {condition}".strip() if prefix else condition

    user_prompt = f"""Find herbal remedies, yoga poses, and acupressure points for: {full_condition}

Be specific and traditional. Include preparation methods, dosages, alignment cues, and point locations."""

    raw     = call_llm(primary="groq", system=system, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[A1] JSON parse failed: {e}")
        print(f"[A1] Raw response: {raw[:500]}")
        raise ValueError(f"A1 returned invalid JSON: {e}")

    required_keys = ["condition", "herbs", "yoga_poses", "acupressure_points"]
    for key in required_keys:
        if key not in result:
            raise ValueError(f"A1 missing key: {key}")

    if len(result["herbs"]) < 5:
        raise ValueError(f"A1 returned only {len(result['herbs'])} herbs, expected 5")

    # Store feature_key in result so downstream agents know which feature is running
    result["feature_key"] = feature_key

    print(f"[A1] Done — {len(result['herbs'])} herbs, "
          f"{len(result['yoga_poses'])} poses, "
          f"{len(result['acupressure_points'])} points")

    return result