# test_a2.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from agents.a1_remedy_hunter import run as a1_run
from agents.a2_science_validator import run as a2_run

# Step 1 - get remedies
a1_result = a1_run("headache")

# Step 2 - validate evidence
a2_result = a2_run(a1_result)

print("\nVALIDATED HERBS:")
for h in a2_result["validated_herbs"]:
    flag = "✓" if h["safe_to_recommend"] else "✗"
    print(f"  {flag} {h['name']}")
    print(f"     Evidence: {h['evidence_level']}")
    print(f"     Summary: {h['evidence_summary']}")
    print(f"     Side effects: {h['known_side_effects']}")

print("\nVALIDATED YOGA POSES:")
for p in a2_result["validated_yoga_poses"]:
    flag = "✓" if p["safe_to_recommend"] else "✗"
    print(f"  {flag} {p['name']} — {p['evidence_level']}")

print("\nVALIDATED ACUPRESSURE POINTS:")
for a in a2_result["validated_acupressure_points"]:
    flag = "✓" if a["safe_to_recommend"] else "✗"
    print(f"  {flag} {a['point_name']} — {a['evidence_level']}")