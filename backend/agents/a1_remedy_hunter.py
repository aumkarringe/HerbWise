# agents/a1_remedy_hunter.py
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

BASE_SYSTEM = """You are a traditional medicine researcher specializing in herbal medicine, yoga therapy, acupressure, and breathing practices.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Do not add any text before or after the JSON.
- Follow the EXACT schema provided — do not add or remove fields.
- Return only what the schema asks for — nothing more.

{feature_focus}

{feature_schema}
"""

def run(condition: str, feature_key: str = "wellness_search") -> dict:
    feature = get_feature_prompt(feature_key)
    group   = get_feature_group(feature_key)

    system = BASE_SYSTEM.format(
        feature_focus=feature["a1_focus"],
        feature_schema=feature["a1_schema"]
    )

    print(f"[A1] Feature: {feature_key} | Group: {group} | Condition: {condition}")

    prefix = feature.get("condition_prefix", "")
    full_condition = f"{prefix} {condition}".strip() if prefix else condition

    user_prompt = f"""Find the best remedies for: {full_condition}

Follow the schema EXACTLY. Return only what the schema specifies.
Be specific with quantities, locations, and instructions."""

    raw     = call_llm(primary="groq", system=system, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[A1] JSON parse failed: {e}")
        print(f"[A1] Raw response: {raw[:500]}")
        raise ValueError(f"A1 returned invalid JSON: {e}")

    # Validate based on group
    if "condition" not in result:
        result["condition"] = condition

    if group == "full":
        # Normalize occasional alias keys returned by the model for full-group features.
        alias_map = {
            "herbs": ["lung_herbs"],
            "yoga_poses": [],
            "acupressure_points": [],
        }
        for key, aliases in alias_map.items():
            if key not in result:
                for alias in aliases:
                    alias_value = result.get(alias)
                    if isinstance(alias_value, list):
                        result[key] = alias_value
                        break
            if key not in result or not isinstance(result.get(key), list):
                result[key] = []
                print(f"[A1] Warning: Missing or invalid key for full group: {key}. Using empty list.")
        print(f"[A1] Done — {len(result['herbs'])} herbs, "
              f"{len(result['yoga_poses'])} poses, "
              f"{len(result['acupressure_points'])} points")

    elif group == "herbs_only":
        if "herbs" not in result:
            raise ValueError("[A1] Missing herbs for herbs_only group")
        print(f"[A1] Done — {len(result['herbs'])} herbs (herbs only feature)")

    elif group == "breathing":
        if "lung_herbs" in result and "herbs" not in result:
            result["herbs"] = result["lung_herbs"]
        for key in ["breathing_techniques", "herbs"]:
            if key not in result:
                raise ValueError(f"[A1] Missing key for breathing group: {key}")
        print(f"[A1] Done — {len(result['breathing_techniques'])} techniques, "
              f"{len(result['herbs'])} respiratory herbs")

    elif group == "exercise":
        if "recovery_herbs" in result and "herbs" not in result:
            result["herbs"] = result["recovery_herbs"]
        for key in ["warmup_poses", "main_sequence_poses", "cooldown_poses", "herbs"]:
            if key not in result:
                raise ValueError(f"[A1] Missing key for exercise group: {key}")
        print(f"[A1] Done — {len(result['warmup_poses'])} warmup, "
              f"{len(result['main_sequence_poses'])} main, "
              f"{len(result['cooldown_poses'])} cooldown, "
              f"{len(result['herbs'])} recovery herbs")

    result["feature_key"] = feature_key
    result["group"]       = group
    return result