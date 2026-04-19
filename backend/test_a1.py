# test_a1.py
from dotenv import load_dotenv
load_dotenv()

from agents.a1_remedy_hunter import run

result = run("headache")

print("HERBS:")
for h in result["herbs"]:
    print(f"  - {h['name']}: {h['preparation']}")

print("\nYOGA POSES:")
for p in result["yoga_poses"]:
    print(f"  - {p['name']} ({p['sanskrit_name']})")

print("\nACUPRESSURE POINTS:")
for a in result["acupressure_points"]:
    print(f"  - {a['point_name']}: {a['location_description']}")