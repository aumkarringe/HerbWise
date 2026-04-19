# test_a4.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from agents.a1_remedy_hunter import run as a1_run
from agents.a2_science_validator import run as a2_run
from agents.a3_pose_verifier import run as a3_run
from agents.a4_citation_checker import run as a4_run

a1_result = a1_run("headache")
a2_result = a2_run(a1_result)
a3_result = a3_run(a2_result)
a4_result = a4_run(a3_result)

print("\nVERIFIED CITATIONS:")
for c in a4_result["verified_citations"]:
    print(f"  ✓ [{c['item_type'].upper()}] {c['item_name']}")
    print(f"     Title: {c['paper_title']}")
    print(f"     Authors: {c['authors']} ({c['year']})")
    print(f"     URL: {c['url']}")
    print(f"     Status: {c['verification_status']}")

print(f"\nREMOVED CITATIONS ({len(a4_result['removed_citations'])}):")
for c in a4_result["removed_citations"]:
    print(f"  ✗ {c['item_name']} — {c['verification_status']}")