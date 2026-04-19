# test_feature_pipeline.py
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from agents.a1_remedy_hunter    import run as a1_run
from agents.a2_science_validator import run as a2_run
from agents.a3_pose_verifier    import run as a3_run
from agents.a4_citation_checker import run as a4_run
from agents.a5_report_builder   import run as a5_run

# Test with sleep_optimizer feature
FEATURE = "sleep_optimizer"
CONDITION = "insomnia"

a1 = a1_run(CONDITION, feature_key=FEATURE)
a2 = a2_run(a1,        feature_key=FEATURE)
a3 = a3_run(a2,        feature_key=FEATURE)
a4 = a4_run(a3,        feature_key=FEATURE)
a5 = a5_run(a4,        feature_key=FEATURE)

print("\n" + "="*50)
print(f"FEATURE: {FEATURE}")
print(f"CONDITION: {CONDITION}")
print("="*50)
print(f"\nBOTTOM LINE:\n{a5['report']['bottom_line']}")
print(f"\nHERBS: {[h['name'] for h in a5['report']['herbs']]}")
print(f"POSES: {[p['name'] for p in a5['report']['yoga_routine']]}")
print(f"POINTS: {[a['point_name'] for a in a5['report']['acupressure_guide']]}")