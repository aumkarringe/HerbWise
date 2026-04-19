# features/dosage_calculator.py
import json
import re
from utils.llm_routere import call_llm

SYSTEM = """You are a clinical herbalist and dosage specialist.

Your job is to calculate personalized herb dosages based on 
the patient's age and weight.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Use Clark's Rule for weight-based dosing: 
  (weight in lbs / 150) × adult dose = personalized dose
- Always include maximum safe dose
- Always include timing (with food, before bed, etc.)
- Flag any herb that needs dose reduction for age

Return this exact schema:
{
  "patient_profile": {
    "age": 0,
    "weight_kg": 0,
    "weight_lbs": 0
  },
  "dosage_table": [
    {
      "herb_name": "string",
      "standard_adult_dose": "string",
      "personalized_dose": "string",
      "max_daily_dose": "string",
      "timing": "string",
      "form": "string",
      "age_adjustment": "string or null",
      "warnings": "string or null"
    }
  ],
  "general_dosage_notes": "string",
  "important_warnings": "string"
}
"""

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

def calculate(a5_output: dict, age: int, weight_kg: float) -> dict:
    """
    Takes A5 report + patient profile → returns personalized dosages.
    """
    report    = a5_output["report"]
    condition = report["condition"]

    print(f"[Dosage Calculator] Age: {age} | Weight: {weight_kg}kg | Condition: {condition}")

    weight_lbs = round(weight_kg * 2.205, 1)

    herbs_data = "\n".join(
        [f"- {h['name']}: standard dose {h['dosage']} | {h['how_to_use']} | "
         f"avoid if: {h['who_should_avoid']}"
         for h in report["herbs"]]
    )

    user_prompt = f"""Calculate personalized herb dosages for:
- Age: {age} years old
- Weight: {weight_kg} kg ({weight_lbs} lbs)
- Condition: {condition}

Herbs to calculate:
{herbs_data}

Apply Clark's Rule where applicable.
Flag any dose adjustments needed for this age/weight profile.
Note any herbs that should be avoided entirely for this profile."""

    raw     = call_llm(primary="gemini", system=SYSTEM, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[Dosage Calculator] JSON parse failed: {e}")
        raise ValueError(f"Dosage calculator returned invalid JSON: {e}")

    # Inject patient profile
    result["patient_profile"] = {
        "age": age,
        "weight_kg": weight_kg,
        "weight_lbs": weight_lbs
    }

    result["original_report"] = report
    print(f"[Dosage Calculator] Calculated doses for {len(result.get('dosage_table', []))} herbs")
    return result