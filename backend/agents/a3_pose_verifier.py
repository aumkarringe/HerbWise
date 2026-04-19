# agents/a3_pose_verifier.py
import json
import re
from utils.llm_routere import call_llm
from utils.feature_prompts import get_feature_prompt

BASE_SYSTEM = """You are a certified yoga therapist and Traditional Chinese Medicine anatomist.

Your job is to verify yoga pose safety and acupressure point accuracy.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Be strict on safety — when in doubt, flag it.

{feature_focus}

Return this exact schema:
{{
  "condition": "string",
  "verified_poses": [
    {{
      "name": "string",
      "sanskrit_name": "string",
      "is_safe": true,
      "contraindication_reason": null,
      "modification": "string",
      "props_needed": null,
      "verified_duration": "string",
      "alignment_cues": "string"
    }}
  ],
  "verified_acupressure_points": [
    {{
      "point_name": "string",
      "anatomy_accurate": true,
      "corrected_location": null,
      "verified_technique": "string",
      "verified_duration": "string",
      "frequency": "string",
      "contraindications": null
    }}
  ],
  "overall_safety_notes": "string"
}}
"""

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

def run(a2_output: dict, feature_key: str = "wellness_search") -> dict:
    feature   = get_feature_prompt(feature_key)
    system    = BASE_SYSTEM.format(feature_focus=feature["a3_focus"])
    condition = a2_output["condition"]
    original  = a2_output.get("original", {})

    print(f"[A3] Feature: {feature_key} | Verifying: {condition}")

    safe_poses = [
        p for p in a2_output["validated_yoga_poses"]
        if p["safe_to_recommend"]
    ]
    safe_points = [
        a for a in a2_output["validated_acupressure_points"]
        if a["safe_to_recommend"]
    ]

    poses_detail = ""
    for p in safe_poses:
        original_pose = next(
            (op for op in original.get("yoga_poses", []) if op["name"] == p["name"]),
            {}
        )
        poses_detail += f"""
- Name: {p['name']} ({original_pose.get('sanskrit_name', 'N/A')})
  Alignment: {original_pose.get('alignment_cues', 'N/A')}
  Duration: {original_pose.get('duration', 'N/A')}
"""

    points_detail = ""
    for a in safe_points:
        original_point = next(
            (op for op in original.get("acupressure_points", []) if op["point_name"] == a["point_name"]),
            {}
        )
        points_detail += f"""
- Point: {a['point_name']}
  Location: {original_point.get('location_description', 'N/A')}
  Technique: {original_point.get('pressure_technique', 'N/A')}
  Duration: {original_point.get('duration', 'N/A')}
"""

    user_prompt = f"""Verify safety and anatomical accuracy for: {condition}

YOGA POSES:
{poses_detail}

ACUPRESSURE POINTS:
{points_detail}

Check contraindications, verify anatomy, add modifications."""

    raw     = call_llm(primary="groq", system=system, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[A3] JSON parse failed: {e}")
        print(f"[A3] Raw response: {raw[:500]}")
        raise ValueError(f"A3 returned invalid JSON: {e}")

    required_keys = ["verified_poses", "verified_acupressure_points"]
    for key in required_keys:
        if key not in result:
            raise ValueError(f"[A3] Missing key: {key}")

    result["condition"]          = condition
    result["feature_key"]        = feature_key
    result["validated_herbs"]    = a2_output["validated_herbs"]
    result["original"]           = original

    safe_count    = sum(1 for p in result["verified_poses"] if p["is_safe"])
    flagged_count = len(result["verified_poses"]) - safe_count
    print(f"[A3] Poses — {safe_count} safe, {flagged_count} flagged")

    return result