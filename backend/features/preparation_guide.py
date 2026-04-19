# features/preparation_guide.py
import json
import re
from utils.llm_routere import call_llm

SYSTEM = """You are a master herbalist and preparation specialist.

Your job is to write detailed step-by-step preparation guides 
for herbal remedies — like recipe cards.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Write instructions a complete beginner can follow
- Include exact quantities, temperatures, and times
- Include storage instructions and shelf life
- Include how to tell if preparation has gone bad

Return this exact schema:
{
  "preparation_guides": [
    {
      "herb_name": "string",
      "preparation_type": "tea|tincture|oil|poultice|capsule|topical",
      "difficulty": "easy|medium|hard",
      "prep_time_minutes": 0,
      "shelf_life": "string",
      "ingredients": [
        {
          "item": "string",
          "quantity": "string"
        }
      ],
      "equipment": ["string"],
      "steps": [
        {
          "step_number": 1,
          "instruction": "string",
          "duration": "string or null",
          "temperature": "string or null",
          "tip": "string or null"
        }
      ],
      "storage_instructions": "string",
      "how_to_tell_if_bad": "string",
      "best_time_to_use": "string"
    }
  ]
}
"""

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

def build_guide(a5_output: dict, herb_name: str = None) -> dict:
    """
    Takes A5 report → builds detailed preparation guides.
    If herb_name is provided, only builds guide for that herb.
    Otherwise builds guides for all herbs in the report.
    """
    report    = a5_output["report"]
    condition = report["condition"]

    # Filter to specific herb or use all
    if herb_name:
        herbs = [h for h in report["herbs"] if h["name"].lower() == herb_name.lower()]
        if not herbs:
            herbs = report["herbs"][:1]  # fallback to first herb
    else:
        herbs = report["herbs"]

    print(f"[Preparation Guide] Building guides for {len(herbs)} herbs")

    herbs_data = "\n".join(
        [f"- {h['name']}: {h['how_to_use']} | Dosage: {h['dosage']}"
         for h in herbs]
    )

    user_prompt = f"""Write detailed preparation guides for these herbs used for {condition}:

{herbs_data}

For each herb provide:
- The most practical preparation method for home use
- Exact step-by-step instructions
- All ingredients with exact quantities
- Equipment needed
- Storage and shelf life
- How to know if it has gone bad
"""

    raw     = call_llm(primary="groq", system=SYSTEM, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[Preparation Guide] JSON parse failed: {e}")
        raise ValueError(f"Preparation guide returned invalid JSON: {e}")

    if "preparation_guides" not in result:
        raise ValueError("[Preparation Guide] Missing 'preparation_guides' key")

    result["original_report"] = report
    result["condition"]       = condition
    print(f"[Preparation Guide] Built {len(result['preparation_guides'])} guides")
    return result