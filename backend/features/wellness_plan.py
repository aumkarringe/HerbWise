# features/wellness_plan.py
import json
import re
from utils.llm_routere import call_llm

SYSTEM = """You are a wellness plan designer.

Your job is to take validated remedy data and format it into a 
structured day-by-day wellness plan.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Distribute remedies evenly across days
- Mix herbs, yoga, and acupressure across morning and evening slots
- Mark which practices are daily vs alternate days
- Keep each day realistic — not overwhelming

Return this exact schema:
{
  "plan_title": "string",
  "duration_days": 7,
  "condition": "string",
  "overview": "string",
  "days": [
    {
      "day": 1,
      "theme": "string",
      "morning": {
        "herbs": ["string"],
        "yoga": ["string"],
        "duration_minutes": 20
      },
      "evening": {
        "herbs": ["string"],
        "acupressure": ["string"],
        "duration_minutes": 15
      },
      "notes": "string"
    }
  ],
  "general_tips": ["string"],
  "what_to_track": ["string"]
}
"""

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

def build_plan(a5_output: dict, duration_days: int = 7) -> dict:
    """
    Takes A5 report output and builds a day-by-day wellness plan.
    """
    report    = a5_output["report"]
    condition = report["condition"]

    print(f"[Wellness Plan] Building {duration_days}-day plan for: {condition}")

    # Summarize available remedies (use .get() throughout — A5 may omit optional fields)
    herbs_list  = report.get("herbs", [])
    poses_list  = report.get("yoga_routine", [])
    points_list = report.get("acupressure_guide", [])

    herb_details = "\n".join(
        [f"- {h.get('name','?')}: {h.get('how_to_use','as directed')} | Dosage: {h.get('dosage','as directed')}"
         for h in herbs_list]
    )
    pose_details = "\n".join(
        [f"- {p.get('name','?')}: hold {p.get('hold_time', p.get('duration','30s'))}"
         for p in poses_list]
    )
    point_details = "\n".join(
        [f"- {a.get('point_name','?')}: {a.get('how_long','1-2 min')} | {a.get('how_often', a.get('frequency','daily'))}"
         for a in points_list]
    )

    user_prompt = f"""Create a {duration_days}-day wellness plan for: {condition}

Available herbs:
{herb_details}

Available yoga poses:
{pose_details}

Available acupressure points:
{point_details}

Rules:
- Day 1-2: gentle introduction (1-2 practices per slot)
- Day 3-5: build up (2-3 practices per slot)
- Day 6-7: full routine (all practices)
- Rotate practices so not everything happens every day
- Morning slots: herbs + yoga
- Evening slots: herbs + acupressure
"""

    raw     = call_llm(primary="gemini", system=SYSTEM, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[Wellness Plan] JSON parse failed: {e}")
        raise ValueError(f"Wellness plan returned invalid JSON: {e}")

    result["original_report"] = report
    print(f"[Wellness Plan] Built {len(result.get('days', []))} day plan")
    return result