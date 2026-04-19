# test_a5.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from agents.a1_remedy_hunter import run as a1_run
from agents.a2_science_validator import run as a2_run
from agents.a3_pose_verifier import run as a3_run
from agents.a4_citation_checker import run as a4_run
from agents.a5_report_builder import run as a5_run

# Run full pipeline
a1 = a1_run("headache")
a2 = a2_run(a1)
a3 = a3_run(a2)
a4 = a4_run(a3)
a5 = a5_run(a4)

report = a5["report"]

print("\n" + "="*60)
print(f"REPORT: {report['condition'].upper()}")
print("="*60)

print(f"\nBOTTOM LINE:\n{report['bottom_line']}")

print("\nHERBS:")
for h in report["herbs"]:
    print(f"\n  {h['name']} [{h['evidence_level'].upper()}]")
    print(f"  How to use: {h['how_to_use']}")
    print(f"  Dosage: {h['dosage']}")
    print(f"  Safety: {h['safety_notes']}")
    print(f"  Avoid if: {h['who_should_avoid']}")

print("\nYOGA ROUTINE:")
for p in report["yoga_routine"]:
    print(f"\n  {p['name']} ({p['sanskrit_name']})")
    print(f"  How to do: {p['how_to_do']}")
    print(f"  Hold: {p['hold_time']}")
    print(f"  Modification: {p['modification']}")
    print(f"  Why it helps: {p['why_it_helps']}")

print("\nACUPRESSURE GUIDE:")
for a in report["acupressure_guide"]:
    print(f"\n  {a['point_name']}")
    print(f"  Where: {a['where_to_find_it']}")
    print(f"  How to apply: {a['how_to_apply']}")
    print(f"  Duration: {a['how_long']}")
    print(f"  Frequency: {a['how_often']}")

print(f"\nSAFETY WARNING:\n{report['general_safety_warning']}")
print(f"\nWHEN TO SEE A DOCTOR:\n{report['when_to_see_doctor']}")

print(f"\nVERIFIED CITATIONS ({len(a5['verified_citations'])}):")
for c in a5["verified_citations"]:
    print(f"  - {c['item_name']}: {c['url']}")