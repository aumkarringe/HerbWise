# test_a3.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from agents.a1_remedy_hunter import run as a1_run
from agents.a2_science_validator import run as a2_run
from agents.a3_pose_verifier import run as a3_run

a1_result = a1_run("headache")
a2_result = a2_run(a1_result)
a3_result = a3_run(a2_result)

print("\nVERIFIED YOGA POSES:")
for p in a3_result["verified_poses"]:
    flag = "✓" if p["is_safe"] else "✗"
    print(f"  {flag} {p['name']}")
    if not p["is_safe"]:
        print(f"     ⚠ Contraindication: {p['contraindication_reason']}")
    print(f"     Modification: {p.get('modification', 'N/A')}")
    print(f"     Props: {p.get('props_needed', 'None')}")
    print(f"     Duration: {p.get('verified_duration', 'N/A')}")

print("\nVERIFIED ACUPRESSURE POINTS:")
for a in a3_result["verified_acupressure_points"]:
    flag = "✓" if a["anatomy_accurate"] else "~"
    print(f"  {flag} {a['point_name']}")
    if a.get("corrected_location"):
        print(f"     📍 Corrected location: {a['corrected_location']}")
    print(f"     Technique: {a.get('verified_technique', 'N/A')}")
    print(f"     Duration: {a.get('verified_duration', 'N/A')}")
    print(f"     Frequency: {a.get('frequency', 'N/A')}")

print(f"\nOVERALL SAFETY NOTES:")
print(f"  {a3_result.get('overall_safety_notes', 'N/A')}")