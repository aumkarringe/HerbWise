# main.py
import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from agents.a1_remedy_hunter     import run as a1_run
from agents.a2_science_validator  import run as a2_run
from agents.a3_pose_verifier     import run as a3_run
from agents.a4_citation_checker  import run as a4_run
from agents.a5_report_builder    import run as a5_run

from features.symptom_analyzer   import analyze as analyze_symptoms
from features.wellness_plan      import build_plan
from features.dosage_calculator  import calculate as calculate_dosage
from features.preparation_guide  import build_guide
from utils.feature_prompts       import get_all_features

app = FastAPI(title="Remedy Validation Pipeline", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Input Models ─────────────────────────────────────────────────────────────

class BaseInput(BaseModel):
    condition: str
    feature_key: Optional[str] = "wellness_search"

class SymptomInput(BaseModel):
    symptoms: str

class SafetyCheckInput(BaseModel):
    condition: str
    age: int
    weight_kg: float
    medications: Optional[str] = ""

class DosageInput(BaseModel):
    condition: str
    age: int
    weight_kg: float

class PreparationInput(BaseModel):
    condition: str
    herb_name: Optional[str] = None

class WellnessPlanInput(BaseModel):
    condition: str
    duration_days: Optional[int] = 7

class SeasonalInput(BaseModel):
    season: Optional[str] = None  # auto-detect if not provided

class NaturalBeautyInput(BaseModel):
    beauty_concern: str

class ExercisePlannerInput(BaseModel):
    condition: str
    fitness_level: Optional[str] = "beginner"


# ─── SSE Helper ───────────────────────────────────────────────────────────────

def sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


# ─── Core Pipeline Runner ─────────────────────────────────────────────────────

async def run_pipeline(condition: str, feature_key: str, extra_data: dict = {}):
    """
    Core pipeline used by ALL features.
    Yields SSE events as each agent completes.
    extra_data is passed to post-processors after A5.
    """
    try:
        # ── A1 ────────────────────────────────────────────────────────────────
        yield sse("agent_start", {
            "agent": "A1", "name": "Remedy Hunter",
            "message": f"Searching remedies for {condition}..."
        })
        a1 = await asyncio.to_thread(a1_run, condition, feature_key)
        yield sse("agent_done", {
            "agent": "A1", "name": "Remedy Hunter",
            "summary": {
                "herbs": len(a1["herbs"]),
                "poses": len(a1["yoga_poses"]),
                "points": len(a1["acupressure_points"])
            }
        })

        # ── A2 ────────────────────────────────────────────────────────────────
        yield sse("agent_start", {
            "agent": "A2", "name": "Science Validator",
            "message": "Checking peer-reviewed evidence..."
        })
        a2 = await asyncio.to_thread(a2_run, a1, feature_key)
        safe_herbs = sum(1 for h in a2["validated_herbs"] if h["safe_to_recommend"])
        yield sse("agent_done", {
            "agent": "A2", "name": "Science Validator",
            "summary": {
                "safe_herbs": safe_herbs,
                "total_herbs": len(a2["validated_herbs"])
            }
        })

        # ── A3 ────────────────────────────────────────────────────────────────
        yield sse("agent_start", {
            "agent": "A3", "name": "Pose & Point Verifier",
            "message": "Verifying yoga safety and acupressure anatomy..."
        })
        a3 = await asyncio.to_thread(a3_run, a2, feature_key)
        safe_poses = sum(1 for p in a3["verified_poses"] if p["is_safe"])
        yield sse("agent_done", {
            "agent": "A3", "name": "Pose & Point Verifier",
            "summary": {
                "safe_poses": safe_poses,
                "total_poses": len(a3["verified_poses"])
            }
        })

        # ── A4 ────────────────────────────────────────────────────────────────
        yield sse("agent_start", {
            "agent": "A4", "name": "Citation Checker",
            "message": "Verifying citations and sources..."
        })
        a4 = await asyncio.to_thread(a4_run, a3, feature_key)
        yield sse("agent_done", {
            "agent": "A4", "name": "Citation Checker",
            "summary": {
                "verified": len(a4["verified_citations"]),
                "removed": len(a4["removed_citations"])
            }
        })

        # ── A5 ────────────────────────────────────────────────────────────────
        yield sse("agent_start", {
            "agent": "A5", "name": "Report Builder",
            "message": "Assembling your report..."
        })
        a5 = await asyncio.to_thread(a5_run, a4, feature_key)
        yield sse("agent_done", {
            "agent": "A5", "name": "Report Builder",
            "summary": {
                "herbs": len(a5["report"]["herbs"]),
                "poses": len(a5["report"]["yoga_routine"]),
                "points": len(a5["report"]["acupressure_guide"])
            }
        })

        # ── Post Processing ───────────────────────────────────────────────────
        post_data = {}

        if feature_key == "wellness_plan":
            yield sse("post_process", {"message": "Building day-by-day plan..."})
            duration = extra_data.get("duration_days", 7)
            post_data["wellness_plan"] = await asyncio.to_thread(
                build_plan, a5, duration
            )

        elif feature_key == "dosage_calculator":
            yield sse("post_process", {"message": "Calculating personalized dosages..."})
            post_data["dosage"] = await asyncio.to_thread(
                calculate_dosage,
                a5,
                extra_data.get("age", 30),
                extra_data.get("weight_kg", 70)
            )

        elif feature_key == "preparation_guide":
            yield sse("post_process", {"message": "Building preparation guides..."})
            post_data["preparation"] = await asyncio.to_thread(
                build_guide,
                a5,
                extra_data.get("herb_name")
            )

        # ── Final Output ──────────────────────────────────────────────────────
        yield sse("complete", {
            "feature_key":        feature_key,
            "report":             a5["report"],
            "verified_citations": a5["verified_citations"],
            "removed_citations":  a5["removed_citations"],
            **post_data
        })

    except Exception as e:
        yield sse("error", {"message": str(e)})


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "Remedy Pipeline API v2 running"}


@app.get("/features")
def list_features():
    """Returns all available features for the frontend sidebar."""
    return {"features": get_all_features()}


# ── 1. Wellness Search ────────────────────────────────────────────────────────
@app.post("/analyze/stream")
async def wellness_search(body: BaseInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    return StreamingResponse(
        run_pipeline(body.condition, body.feature_key or "wellness_search"),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 2. Symptom Analyzer ───────────────────────────────────────────────────────
@app.post("/symptom-analyzer/stream")
async def symptom_analyzer(body: SymptomInput):
    if not body.symptoms.strip():
        raise HTTPException(400, "Symptoms cannot be empty")

    async def stream():
        yield sse("pre_process", {"message": "Analyzing your symptoms..."})
        condition = await asyncio.to_thread(analyze_symptoms, body.symptoms)
        yield sse("pre_process_done", {"detected_condition": condition})
        async for event in run_pipeline(condition, "symptom_analyzer"):
            yield event

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 3. Safety Check ───────────────────────────────────────────────────────────
@app.post("/safety-check/stream")
async def safety_check(body: SafetyCheckInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")

    # Enrich condition with patient profile
    enriched = (
        f"{body.condition} for a {body.age} year old, "
        f"{body.weight_kg}kg patient"
        + (f" taking {body.medications}" if body.medications else "")
    )

    return StreamingResponse(
        run_pipeline(enriched, "safety_check", {
            "age": body.age,
            "weight_kg": body.weight_kg,
            "medications": body.medications
        }),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 4. Wellness Plan ──────────────────────────────────────────────────────────
@app.post("/wellness-plan/stream")
async def wellness_plan(body: WellnessPlanInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    return StreamingResponse(
        run_pipeline(body.condition, "wellness_plan", {
            "duration_days": body.duration_days
        }),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 5. Dosage Calculator ──────────────────────────────────────────────────────
@app.post("/dosage-calculator/stream")
async def dosage_calculator(body: DosageInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    return StreamingResponse(
        run_pipeline(body.condition, "dosage_calculator", {
            "age": body.age,
            "weight_kg": body.weight_kg
        }),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 6. Preparation Guide ──────────────────────────────────────────────────────
@app.post("/preparation-guide/stream")
async def preparation_guide(body: PreparationInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    return StreamingResponse(
        run_pipeline(body.condition, "preparation_guide", {
            "herb_name": body.herb_name
        }),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 7. Seasonal Remedies ──────────────────────────────────────────────────────
@app.post("/seasonal-remedies/stream")
async def seasonal_remedies(body: SeasonalInput):
    import datetime
    if not body.season:
        month = datetime.datetime.now().month
        if month in [12, 1, 2]:   season = "winter"
        elif month in [3, 4, 5]:  season = "spring"
        elif month in [6, 7, 8]:  season = "summer"
        else:                      season = "autumn"
    else:
        season = body.season

    condition = f"seasonal wellness for {season}"
    return StreamingResponse(
        run_pipeline(condition, "seasonal_remedies", {"season": season}),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 8. Natural Beauty ─────────────────────────────────────────────────────────
@app.post("/natural-beauty/stream")
async def natural_beauty(body: NaturalBeautyInput):
    if not body.beauty_concern.strip():
        raise HTTPException(400, "Beauty concern cannot be empty")
    return StreamingResponse(
        run_pipeline(body.beauty_concern, "natural_beauty"),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 9. Sleep Optimizer ────────────────────────────────────────────────────────
@app.post("/sleep-optimizer/stream")
async def sleep_optimizer():
    return StreamingResponse(
        run_pipeline("insomnia and sleep quality", "sleep_optimizer"),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 10. Stress Relief ─────────────────────────────────────────────────────────
@app.post("/stress-relief/stream")
async def stress_relief():
    return StreamingResponse(
        run_pipeline("stress and anxiety", "stress_relief"),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 11. Immunity Booster ──────────────────────────────────────────────────────
@app.post("/immunity-booster/stream")
async def immunity_booster():
    return StreamingResponse(
        run_pipeline("immune system support", "immunity_booster"),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 12. Breathing Test ────────────────────────────────────────────────────────
@app.post("/breathing-test/stream")
async def breathing_test():
    return StreamingResponse(
        run_pipeline("respiratory health and breathing exercises", "breathing_test"),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 13. Home Remedies+ ────────────────────────────────────────────────────────
@app.post("/home-remedies/stream")
async def home_remedies(body: BaseInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    return StreamingResponse(
        run_pipeline(body.condition, "home_remedies_plus"),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── 14. Exercise Planner ──────────────────────────────────────────────────────
@app.post("/exercise-planner/stream")
async def exercise_planner(body: ExercisePlannerInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    condition = f"{body.condition} — fitness level: {body.fitness_level}"
    return StreamingResponse(
        run_pipeline(condition, "exercise_planner", {
            "fitness_level": body.fitness_level
        }),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )