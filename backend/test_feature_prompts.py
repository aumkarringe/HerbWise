# test_feature_prompts.py
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.feature_prompts import get_feature_prompt, get_all_features

# Test 1 — get all features
features = get_all_features()
print(f"Total features: {len(features)}")
for f in features:
    print(f"  {f['key']} → {f['label']}")

# Test 2 — get a specific feature
sleep = get_feature_prompt("sleep_optimizer")
print(f"\nSleep Optimizer A1 focus:\n{sleep['a1_focus'][:100]}...")

# Test 3 — fallback for unknown feature
unknown = get_feature_prompt("nonexistent_feature")
print(f"\nFallback label: {unknown['label']}")