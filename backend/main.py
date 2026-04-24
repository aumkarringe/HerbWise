# main.py
import os
import json
import asyncio
import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from collections import defaultdict
from utils.cache import make_cache_key, get_cached, set_cached, is_redis_alive, get_cache_stats

load_dotenv()

# ─── Rate Limiting Setup ──────────────────────────────────────────────────────
RATE_LIMIT_STORE = defaultdict(list)
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX    = 20

def is_rate_limited(client_ip: str) -> bool:
    now    = time.time()
    cutoff = now - RATE_LIMIT_WINDOW
    RATE_LIMIT_STORE[client_ip] = [
        ts for ts in RATE_LIMIT_STORE[client_ip] if ts > cutoff
    ]
    if len(RATE_LIMIT_STORE[client_ip]) >= RATE_LIMIT_MAX:
        return True
    RATE_LIMIT_STORE[client_ip].append(now)
    return False

from agents.a1_remedy_hunter    import run as a1_run
from agents.a2_science_validator import run as a2_run
from agents.a3_pose_verifier    import run as a3_run
from agents.a4_citation_checker import run as a4_run
from agents.a5_report_builder   import run as a5_run

from features.symptom_analyzer  import analyze as analyze_symptoms
from features.wellness_plan     import build_plan
from features.dosage_calculator import calculate as calculate_dosage
from features.preparation_guide import build_guide
from utils.feature_prompts      import get_all_features, get_feature_group, should_skip_a3

app = FastAPI(title="Remedy Validation Pipeline", version="2.0.0")

# ─── CORS ────────────────────────────────────────────────────────────────────
# Add your Vercel URL here after deploying frontend
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("https://herb-wise-theta.vercel.app/", ""),        # set this in Render env vars
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],  # filter empty strings
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)


# ─── Rate Limiting Middleware ─────────────────────────────────────────────────
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    if is_rate_limited(client_ip):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Maximum 20 per minute."}
        )
    return await call_next(request)


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
    season: Optional[str] = None

class NaturalBeautyInput(BaseModel):
    beauty_concern: str

class ExercisePlannerInput(BaseModel):
    condition: str
    fitness_level: Optional[str] = "beginner"


# ─── Global Error Handler ─────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_str = str(exc).lower()
    if any(x in error_str for x in ["file", "path", "database", "connection", "node_modules"]):
        detail = "An error occurred processing your request"
    else:
        detail = str(exc) if len(str(exc)) < 100 else "An error occurred"
    return JSONResponse(status_code=500, content={"detail": detail})


# ─── SSE Helper ───────────────────────────────────────────────────────────────
def sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


# ─── Core Pipeline Runner ─────────────────────────────────────────────────────
async def run_pipeline(
    condition: str,
    feature_key: str,
    extra_data: dict = {},
    cache_key: str = None
):
    try:
        group = get_feature_group(feature_key)

        def list_len(data: dict, *keys: str) -> int:
            for key in keys:
                val = data.get(key)
                if isinstance(val, list):
                    return len(val)
            return 0

        # ── Check Cache First ─────────────────────────────────────────────────
        if cache_key:
            cached = get_cached(cache_key)
            if cached:
                yield sse("cache_hit", {
                    "message": f"Found cached result for '{condition}'",
                    "condition": condition
                })
                agents    = ["A1", "A2", "A4", "A5"] if should_skip_a3(feature_key) else ["A1", "A2", "A3", "A4", "A5"]
                names_map = {
                    "A1": "Remedy Hunter",
                    "A2": "Science Validator",
                    "A3": "Pose & Point Verifier",
                    "A4": "Citation Checker",
                    "A5": "Report Builder",
                }
                for agent in agents:
                    yield sse("agent_start", {
                        "agent": agent,
                        "name":  names_map[agent],
                        "message": "Loading from cache..."
                    })
                    yield sse("agent_done", {
                        "agent":   agent,
                        "name":    names_map[agent],
                        "summary": cached.get("summaries", {}).get(agent, {})
                    })
                yield sse("complete", cached["result"])
                return

        # ── No Cache — Run Full Pipeline ──────────────────────────────────────
        summaries = {}

        # A1
        yield sse("agent_start", {
            "agent": "A1", "name": "Remedy Hunter",
            "message": f"Searching remedies for {condition}..."
        })
        a1 = await asyncio.to_thread(a1_run, condition, feature_key)

        if group == "full":
            summary_a1 = {
                "herbs": list_len(a1, "herbs", "topical_herbs", "sleep_herbs",
                                  "adaptogen_herbs", "immune_herbs", "kitchen_remedies"),
                "poses": list_len(a1, "yoga_poses", "beauty_yoga_poses", "bedtime_yoga_poses",
                                  "calming_yoga_poses", "lymphatic_yoga_poses", "no_equipment_poses"),
                "points": list_len(a1, "acupressure_points", "face_acupressure_points",
                                   "sleep_acupressure_points", "stress_acupressure_points",
                                   "wei_qi_acupressure_points", "easy_acupressure_points")
            }
        elif group == "herbs_only":
            summary_a1 = {"herbs": list_len(a1, "herbs")}
        elif group == "breathing":
            summary_a1 = {
                "techniques": list_len(a1, "breathing_techniques"),
                "herbs":      list_len(a1, "lung_support_herbs")
            }
        else:  # exercise
            summary_a1 = {
                "warmup":   list_len(a1, "warmup_poses"),
                "main":     list_len(a1, "main_sequence_poses"),
                "cooldown": list_len(a1, "cooldown_poses"),
                "herbs":    list_len(a1, "recovery_herbs")
            }
        summaries["A1"] = summary_a1
        yield sse("agent_done", {"agent": "A1", "name": "Remedy Hunter", "summary": summary_a1})

        # A2
        yield sse("agent_start", {
            "agent": "A2", "name": "Science Validator",
            "message": "Checking peer-reviewed evidence..."
        })
        a2 = await asyncio.to_thread(a2_run, a1, feature_key)

        if group in ["full", "herbs_only"]:
            validated_herbs = a2.get("validated_herbs", [])
            safe_herbs      = sum(1 for h in validated_herbs if h.get("safe_to_recommend"))
            summary_a2      = {"safe_herbs": safe_herbs, "total_herbs": len(validated_herbs)}
        elif group == "breathing":
            validated_techniques = a2.get("validated_techniques", [])
            safe_techniques      = sum(1 for t in validated_techniques if t.get("safe_to_recommend"))
            summary_a2           = {"safe_techniques": safe_techniques, "total": len(validated_techniques)}
        else:  # exercise
            validated_main = a2.get("validated_main_sequence", [])
            safe_main      = sum(1 for p in validated_main if p.get("safe_to_recommend"))
            summary_a2     = {"safe_main": safe_main, "total_main": len(validated_main)}
        summaries["A2"] = summary_a2
        yield sse("agent_done", {"agent": "A2", "name": "Science Validator", "summary": summary_a2})

        # A3
        if should_skip_a3(feature_key):
            a3         = await asyncio.to_thread(a3_run, a2, feature_key)
            summary_a3 = {"skipped": True}
        else:
            yield sse("agent_start", {
                "agent": "A3", "name": "Pose & Point Verifier",
                "message": "Verifying yoga safety and acupressure anatomy..."
            })
            a3 = await asyncio.to_thread(a3_run, a2, feature_key)

            if group == "exercise":
                verified_main = a3.get("verified_main_sequence", [])
                safe_main     = sum(1 for p in verified_main if p.get("is_safe"))
                summary_a3    = {"safe_main": safe_main, "total_main": len(verified_main)}
            else:
                verified_poses = a3.get("verified_poses", [])
                safe_poses     = sum(1 for p in verified_poses if p.get("is_safe"))
                summary_a3     = {"safe_poses": safe_poses, "total_poses": len(verified_poses)}

            yield sse("agent_done", {
                "agent": "A3", "name": "Pose & Point Verifier", "summary": summary_a3
            })
        summaries["A3"] = summary_a3

        # A4
        yield sse("agent_start", {
            "agent": "A4", "name": "Citation Checker",
            "message": "Verifying citations and sources..."
        })
        a4         = await asyncio.to_thread(a4_run, a3, feature_key)
        summary_a4 = {
            "verified": len(a4["verified_citations"]),
            "removed":  len(a4["removed_citations"])
        }
        summaries["A4"] = summary_a4
        yield sse("agent_done", {"agent": "A4", "name": "Citation Checker", "summary": summary_a4})

        # A5
        yield sse("agent_start", {
            "agent": "A5", "name": "Report Builder",
            "message": "Assembling your report..."
        })
        a5     = await asyncio.to_thread(a5_run, a4, feature_key)
        report = a5.get("report", {})

        if group == "full":
            summary_a5 = {
                "sections": sum(1 for k in [
                    "herbs", "yoga_routine", "acupressure_guide",
                    "sleep_herbs", "immune_herbs", "stress_herbs",
                    "kitchen_remedy_recipes", "diy_beauty_recipes",
                    "bedtime_routine", "daily_maintenance"
                ] if k in report)
            }
        elif group == "herbs_only":
            summary_a5 = {
                "herbs": list_len(report, "safety_rated_herbs", "dosage_table", "preparation_guides")
            }
        elif group == "breathing":
            summary_a5 = {
                "techniques": list_len(report, "breathing_technique_guides"),
                "schedule":   list_len(report, "seven_day_schedule")
            }
        else:  # exercise
            summary_a5 = {
                "warmup":   list_len(report, "warmup"),
                "main":     list_len(report, "main_sequence"),
                "cooldown": list_len(report, "cooldown")
            }
        summaries["A5"] = summary_a5
        yield sse("agent_done", {"agent": "A5", "name": "Report Builder", "summary": summary_a5})

        # ── Post Processing ───────────────────────────────────────────────────
        post_data = {}

        if feature_key == "wellness_plan":
            yield sse("post_process", {"message": "Building day-by-day plan..."})
            duration            = extra_data.get("duration_days", 7)
            post_data["wellness_plan"] = await asyncio.to_thread(build_plan, a5, duration)

        elif feature_key == "dosage_calculator":
            yield sse("post_process", {"message": "Calculating personalized dosages..."})
            post_data["dosage"] = await asyncio.to_thread(
                calculate_dosage, a5,
                extra_data.get("age", 30),
                extra_data.get("weight_kg", 70)
            )

        elif feature_key == "preparation_guide":
            yield sse("post_process", {"message": "Building preparation guides..."})
            post_data["preparation"] = await asyncio.to_thread(
                build_guide, a5, extra_data.get("herb_name")
            )

        # ── Final Result ──────────────────────────────────────────────────────
        final_result = {
            "feature_key":        feature_key,
            "report":             a5["report"],
            "verified_citations": a5["verified_citations"],
            "removed_citations":  a5["removed_citations"],
            **post_data
        }

        # ── Store in Cache ────────────────────────────────────────────────────
        if cache_key:
            set_cached(cache_key, {
                "result":    final_result,
                "summaries": summaries
            })

        yield sse("complete", final_result)

    except Exception as e:
        yield sse("error", {"message": str(e)})


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "HerbWise API running", "version": "2.0.0"}


@app.get("/health")
def health():
    """Health check endpoint for Render."""
    return {
        "status":  "healthy",
        "redis":   is_redis_alive(),
    }


@app.get("/features")
def list_features():
    return {"features": get_all_features()}


@app.get("/cache/stats")
def cache_stats():
    return get_cache_stats()


@app.delete("/cache/clear")
def clear_cache():
    from utils.cache import client
    if client is None:
        return {"cleared": 0, "message": "Redis not connected"}
    keys = client.keys("remedy:*")
    if keys:
        client.delete(*keys)
    return {"cleared": len(keys), "message": f"Deleted {len(keys)} cached results"}


@app.delete("/cache/clear/{feature_key}")
def clear_feature_cache(feature_key: str):
    from utils.cache import client
    if client is None:
        return {"cleared": 0, "feature": feature_key}
    keys = client.keys(f"remedy:{feature_key}:*")
    if keys:
        client.delete(*keys)
    return {"cleared": len(keys), "feature": feature_key}


# ── Wellness Search ───────────────────────────────────────────────────────────
@app.post("/analyze/stream")
async def wellness_search(body: BaseInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    cache_key = make_cache_key(
        feature_key=body.feature_key or "wellness_search",
        condition=body.condition
    )
    return StreamingResponse(
        run_pipeline(body.condition, body.feature_key or "wellness_search",
                     cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Symptom Analyzer ──────────────────────────────────────────────────────────
@app.post("/symptom-analyzer/stream")
async def symptom_analyzer(body: SymptomInput):
    if not body.symptoms.strip():
        raise HTTPException(400, "Symptoms cannot be empty")

    async def stream():
        yield sse("pre_process", {"message": "Analyzing your symptoms..."})
        condition = await asyncio.to_thread(analyze_symptoms, body.symptoms)
        yield sse("pre_process_done", {"detected_condition": condition})
        cache_key = make_cache_key("symptom_analyzer", condition)
        async for event in run_pipeline(condition, "symptom_analyzer",
                                        cache_key=cache_key):
            yield event

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Safety Check ──────────────────────────────────────────────────────────────
@app.post("/safety-check/stream")
async def safety_check(body: SafetyCheckInput):
    enriched = (
        f"{body.condition} for a {body.age} year old "
        f"{body.weight_kg}kg patient"
        + (f" taking {body.medications}" if body.medications else "")
    )
    cache_key = make_cache_key("safety_check", body.condition, {
        "age": body.age,
        "weight_kg": body.weight_kg,
        "medications": body.medications
    })
    return StreamingResponse(
        run_pipeline(enriched, "safety_check", cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Wellness Plan ─────────────────────────────────────────────────────────────
@app.post("/wellness-plan/stream")
async def wellness_plan(body: WellnessPlanInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    cache_key = make_cache_key("wellness_plan", body.condition, {
        "duration_days": body.duration_days
    })
    return StreamingResponse(
        run_pipeline(body.condition, "wellness_plan",
                     extra_data={"duration_days": body.duration_days},
                     cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Dosage Calculator ─────────────────────────────────────────────────────────
@app.post("/dosage-calculator/stream")
async def dosage_calculator(body: DosageInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    cache_key = make_cache_key("dosage_calculator", body.condition, {
        "age": body.age,
        "weight_kg": body.weight_kg
    })
    return StreamingResponse(
        run_pipeline(body.condition, "dosage_calculator",
                     extra_data={"age": body.age, "weight_kg": body.weight_kg},
                     cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Preparation Guide ─────────────────────────────────────────────────────────
@app.post("/preparation-guide/stream")
async def preparation_guide(body: PreparationInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    cache_key = make_cache_key("preparation_guide", body.condition, {
        "herb_name": body.herb_name
    })
    return StreamingResponse(
        run_pipeline(body.condition, "preparation_guide",
                     extra_data={"herb_name": body.herb_name},
                     cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Seasonal Remedies ─────────────────────────────────────────────────────────
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
    cache_key = make_cache_key("seasonal_remedies", condition)
    return StreamingResponse(
        run_pipeline(condition, "seasonal_remedies", cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Natural Beauty ────────────────────────────────────────────────────────────
@app.post("/natural-beauty/stream")
async def natural_beauty(body: NaturalBeautyInput):
    if not body.beauty_concern.strip():
        raise HTTPException(400, "Beauty concern cannot be empty")
    cache_key = make_cache_key("natural_beauty", body.beauty_concern)
    return StreamingResponse(
        run_pipeline(body.beauty_concern, "natural_beauty", cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Sleep Optimizer ───────────────────────────────────────────────────────────
@app.post("/sleep-optimizer/stream")
async def sleep_optimizer():
    cache_key = make_cache_key("sleep_optimizer", "insomnia and sleep quality")
    return StreamingResponse(
        run_pipeline("insomnia and sleep quality", "sleep_optimizer",
                     cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Stress Relief ─────────────────────────────────────────────────────────────
@app.post("/stress-relief/stream")
async def stress_relief():
    cache_key = make_cache_key("stress_relief", "stress and anxiety")
    return StreamingResponse(
        run_pipeline("stress and anxiety", "stress_relief",
                     cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Immunity Booster ──────────────────────────────────────────────────────────
@app.post("/immunity-booster/stream")
async def immunity_booster():
    cache_key = make_cache_key("immunity_booster", "immune system support")
    return StreamingResponse(
        run_pipeline("immune system support", "immunity_booster",
                     cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Breathing Test ────────────────────────────────────────────────────────────
@app.post("/breathing-test/stream")
async def breathing_test():
    cache_key = make_cache_key("breathing_test", "respiratory health")
    return StreamingResponse(
        run_pipeline("respiratory health and breathing exercises",
                     "breathing_test", cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Home Remedies+ ────────────────────────────────────────────────────────────
@app.post("/home-remedies/stream")
async def home_remedies(body: BaseInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    cache_key = make_cache_key("home_remedies_plus", body.condition)
    return StreamingResponse(
        run_pipeline(body.condition, "home_remedies_plus", cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── Exercise Planner ──────────────────────────────────────────────────────────
@app.post("/exercise-planner/stream")
async def exercise_planner(body: ExercisePlannerInput):
    if not body.condition.strip():
        raise HTTPException(400, "Condition cannot be empty")
    condition = f"{body.condition} — fitness level: {body.fitness_level}"
    cache_key = make_cache_key("exercise_planner", body.condition, {
        "fitness_level": body.fitness_level
    })
    return StreamingResponse(
        run_pipeline(condition, "exercise_planner",
                     extra_data={"fitness_level": body.fitness_level},
                     cache_key=cache_key),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )