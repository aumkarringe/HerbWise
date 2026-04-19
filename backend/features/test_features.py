# test_features.py
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from agents.a1_remedy_hunter     import run as a1_run
from agents.a2_science_validator  import run as a2_run
from agents.a3_pose_verifier     import run as a3_run
from agents.a4_citation_checker  import run as a4_run
from agents.a5_report_builder    import run as a5_run

from features.symptom_analyzer   import analyze
from features.wellness_plan      import build_plan
from features.dosage_calculator  import calculate
from features.preparation_guide  import build_guide

# ── Test 1: Symptom Analyzer ─────────────────────────────────
print("\n" + "="*50)
print("TEST 1: Symptom Analyzer")
print("="*50)
condition = analyze("I can't sleep, feel anxious, racing heart at night")
print(f"Detected condition: {condition}")

# ── Test 2: Full pipeline + Wellness Plan ────────────────────
print("\n" + "="*50)
print("TEST 2: Wellness Plan")
print("="*50)
a1 = a1_run("insomnia", feature_key="wellness_plan")
a2 = a2_run(a1, feature_key="wellness_plan")
a3 = a3_run(a2, feature_key="wellness_plan")
a4 = a4_run(a3, feature_key="wellness_plan")
a5 = a5_run(a4, feature_key="wellness_plan")
plan = build_plan(a5, duration_days=7)
print(f"Plan title: {plan['plan_title']}")
print(f"Days built: {len(plan['days'])}")
for day in plan["days"][:2]:  # show first 2 days
    print(f"  Day {day['day']} — {day['theme']}")
    print(f"    Morning: {day['morning']}")
    print(f"    Evening: {day['evening']}")

# ── Test 3: Dosage Calculator ────────────────────────────────
print("\n" + "="*50)
print("TEST 3: Dosage Calculator")
print("="*50)
dosage = calculate(a5, age=35, weight_kg=70)
print(f"Patient: {dosage['patient_profile']}")
for d in dosage["dosage_table"]:
    print(f"  {d['herb_name']}: {d['personalized_dose']} | Max: {d['max_daily_dose']}")

# ── Test 4: Preparation Guide ────────────────────────────────
print("\n" + "="*50)
print("TEST 4: Preparation Guide")
print("="*50)
guide = build_guide(a5)
for g in guide["preparation_guides"]:
    print(f"  {g['herb_name']} — {g['preparation_type']} ({g['difficulty']})")
    print(f"    Prep time: {g['prep_time_minutes']} min")
    print(f"    Shelf life: {g['shelf_life']}")
    print(f"    Steps: {len(g['steps'])}")