# agents/a3_pose_verifier.py
import json
import re
from utils.llm_routere import call_llm
from utils.feature_prompts import get_feature_prompt, get_feature_group, should_skip_a3

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

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

EXERCISE_SYSTEM = """You are a certified yoga therapist and exercise safety specialist.

Your job is to verify that the exercise sequence flows safely and is appropriate.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Be strict on safety — check sequence flow carefully.

{feature_focus}

Return this exact schema:
{{
  "condition": "string",
  "verified_warmup": [
    {{
      "name": "string",
      "sanskrit_name": "string",
      "is_safe": true,
      "contraindication_reason": null,
      "modification": "string",
      "verified_duration": "string",
      "alignment_cues": "string"
    }}
  ],
  "verified_main_sequence": [
    {{
      "name": "string",
      "sanskrit_name": "string",
      "is_safe": true,
      "contraindication_reason": null,
      "modification": "string",
      "verified_duration": "string",
      "alignment_cues": "string",
      "beginner_variation": "string",
      "advanced_variation": "string"
    }}
  ],
  "verified_cooldown": [
    {{
      "name": "string",
      "sanskrit_name": "string",
      "is_safe": true,
      "contraindication_reason": null,
      "modification": "string",
      "verified_duration": "string",
      "alignment_cues": "string"
    }}
  ],
  "sequence_safety_notes": "string",
  "overall_safety_notes": "string"
}}
"""

def _build_passthrough(a2_output: dict) -> dict:
    """
    For features that skip A3 — pass A2 output through
    with the same structure A4 expects.
    """
    group = a2_output.get("group", "full")
    result = {
        "condition":            a2_output["condition"],
        "feature_key":          a2_output["feature_key"],
        "group":                group,
        "original":             a2_output.get("original", {}),
        "overall_safety_notes": "A3 skipped for this feature type.",
    }

    if group == "herbs_only":
        result["validated_herbs"]             = a2_output.get("validated_herbs", [])
        result["verified_poses"]              = []
        result["verified_acupressure_points"] = []

    elif group == "breathing":
        result["validated_techniques"]        = a2_output.get("validated_techniques", [])
        result["validated_lung_herbs"]        = a2_output.get("validated_lung_herbs", [])
        result["verified_poses"]              = []
        result["verified_acupressure_points"] = []

    else:
        result["validated_herbs"]             = a2_output.get("validated_herbs", [])
        result["verified_poses"]              = []
        result["verified_acupressure_points"] = []

    return result

def run(a2_output: dict, feature_key: str = "wellness_search") -> dict:
    group = get_feature_group(feature_key)

    # Skip A3 for herb-only and breathing features
    if should_skip_a3(feature_key):
        print(f"[A3] SKIPPED for feature: {feature_key}")
        return _build_passthrough(a2_output)

    feature   = get_feature_prompt(feature_key)
    condition = a2_output["condition"]
    original  = a2_output.get("original", {})

    print(f"[A3] Feature: {feature_key} | Group: {group} | Verifying: {condition}")

    # ── Exercise group — different schema ─────────────────────────────────────
    if group == "exercise":
        system = EXERCISE_SYSTEM.format(feature_focus=feature["a3_focus"])

        warmup_detail = "\n".join([
            f"- {p['name']} ({p.get('sanskrit_name','')}) — {p.get('alignment_cues','')}"
            for p in original.get("warmup_poses", [])
            if any(v["name"] == p["name"] and v["safe_to_recommend"]
                   for v in a2_output.get("validated_warmup", []))
        ])
        main_detail = "\n".join([
            f"- {p['name']} ({p.get('sanskrit_name','')}) — {p.get('alignment_cues','')}"
            for p in original.get("main_sequence_poses", [])
            if any(v["name"] == p["name"] and v["safe_to_recommend"]
                   for v in a2_output.get("validated_main_sequence", []))
        ])
        cool_detail = "\n".join([
            f"- {p['name']} ({p.get('sanskrit_name','')}) — {p.get('alignment_cues','')}"
            for p in original.get("cooldown_poses", [])
            if any(v["name"] == p["name"] and v["safe_to_recommend"]
                   for v in a2_output.get("validated_cooldown", []))
        ])

        user_prompt = f"""Verify the safety of this exercise sequence for: {condition}

WARMUP POSES:
{warmup_detail}

MAIN SEQUENCE POSES:
{main_detail}

COOLDOWN POSES:
{cool_detail}

Check sequence flow, contraindications, and add beginner/advanced variations."""

        raw     = call_llm(primary="groq", system=system, user=user_prompt)
        cleaned = clean_json_response(raw)

        try:
            result = json.loads(cleaned)
        except json.JSONDecodeError as e:
            print(f"[A3] Exercise JSON parse failed: {e}")
            raise ValueError(f"A3 exercise returned invalid JSON: {e}")

        result["condition"]              = condition
        result["feature_key"]            = feature_key
        result["group"]                  = group
        result["validated_recovery_herbs"] = a2_output.get("validated_recovery_herbs", [])
        result["original"]               = original

        safe = sum(1 for p in result.get("verified_main_sequence", []) if p["is_safe"])
        print(f"[A3] Exercise — {safe} main poses verified safe")
        return result

    # ── Full group — standard pose + acupressure verification ─────────────────
    system = BASE_SYSTEM.format(feature_focus=feature["a3_focus"])

    safe_poses = [
        p for p in a2_output.get("validated_yoga_poses", [])
        if p["safe_to_recommend"]
    ]
    safe_points = [
        a for a in a2_output.get("validated_acupressure_points", [])
        if a["safe_to_recommend"]
    ]

    poses_detail = ""
    for p in safe_poses:
        orig = next((op for op in original.get("yoga_poses", [])
                     if op["name"] == p["name"]), {})
        poses_detail += f"""
- {p['name']} ({orig.get('sanskrit_name','N/A')})
  Alignment: {orig.get('alignment_cues','N/A')}
  Duration: {orig.get('duration','N/A')}
"""

    points_detail = ""
    for a in safe_points:
        orig = next((op for op in original.get("acupressure_points", [])
                     if op.get("point_name") == a["point_name"]), {})
        points_detail += f"""
- {a['point_name']}
  Location: {orig.get('location_description','N/A')}
  Technique: {orig.get('pressure_technique','N/A')}
  Duration: {orig.get('duration','N/A')}
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
        raise ValueError(f"A3 returned invalid JSON: {e}")

    for key in ["verified_poses", "verified_acupressure_points"]:
        if key not in result:
            raise ValueError(f"[A3] Missing key: {key}")

    result["condition"]       = condition
    result["feature_key"]     = feature_key
    result["group"]           = group
    result["validated_herbs"] = a2_output.get("validated_herbs", [])
    result["original"]        = original

    safe_count    = sum(1 for p in result["verified_poses"] if p["is_safe"])
    flagged_count = len(result["verified_poses"]) - safe_count
    print(f"[A3] Poses — {safe_count} safe, {flagged_count} flagged")
    return result