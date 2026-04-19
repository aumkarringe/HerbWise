# utils/feature_prompts.py

FEATURE_PROMPTS = {

    "wellness_search": {
        "label": "Wellness Search",
        "a1_focus": """Find a comprehensive mix of herbal remedies, yoga poses, and acupressure points 
for the given condition. Cover all three modalities equally and thoroughly.""",
        "a2_focus": """Validate evidence across all three modalities equally. 
Focus on peer-reviewed studies from the last 10 years where possible.""",
        "a3_focus": """Verify safety and anatomy for general wellness use. 
Add beginner-friendly modifications for all poses.""",
        "a5_focus": """Write a comprehensive wellness report covering all three modalities equally. 
Make it easy for a complete beginner to follow.""",
        "condition_prefix": "",
        "extra_inputs": []
    },

    "symptom_analyzer": {
        "label": "Symptom Analyzer",
        "a1_focus": """The condition provided is derived from user symptoms. 
Find remedies specifically targeting the root causes of these symptoms, 
not just surface-level relief. Include remedies that address multiple symptoms at once.""",
        "a2_focus": """Focus evidence validation on symptom-relief research. 
Look for studies that measured specific symptom reduction as outcomes.""",
        "a3_focus": """Pay extra attention to contraindications — 
symptom-based conditions may have underlying causes that make certain poses unsafe. 
Flag anything that could worsen symptoms.""",
        "a5_focus": """Write the report from a symptom-relief perspective. 
Explain how each remedy addresses the specific symptoms listed. 
Include a symptom tracking tip at the end.""",
        "condition_prefix": "symptoms including",
        "extra_inputs": ["symptoms"]
    },

    "safety_check": {
        "label": "Safety Check",
        "a1_focus": """Find remedies for the condition with a STRONG focus on safety. 
Only include herbs with well-established safety profiles. 
Note any herbs commonly known to interact with medications.""",
        "a2_focus": """Prioritize safety evidence above efficacy evidence. 
Look specifically for:
- Drug interaction studies
- Contraindication research  
- Studies on safety in specific populations (elderly, pregnant, children)
Flag anything with moderate or higher risk.""",
        "a3_focus": """This is a safety-focused check. 
Be extra strict on yoga contraindications. 
Flag any pose that could be risky for someone with underlying conditions.
Add detailed modification instructions for every pose.""",
        "a5_focus": """Write a safety-first report. 
Lead every section with safety warnings before benefits. 
Include a clear WHO SHOULD AVOID section for every remedy. 
Add a medications interaction table if relevant.""",
        "condition_prefix": "",
        "extra_inputs": ["age", "weight", "medications"]
    },

    "wellness_plan": {
        "label": "Wellness Plan",
        "a1_focus": """Find remedies suitable for a sustained multi-day wellness routine. 
Focus on remedies that are:
- Safe for daily long-term use
- Easy to prepare and practice daily
- Complementary to each other (herbs + yoga + acupressure that work together)""",
        "a2_focus": """Focus on evidence for long-term or repeated use. 
Look for studies on sustained use over weeks or months. 
Flag any remedy that should NOT be used daily long-term.""",
        "a3_focus": """Design a progressive yoga sequence — 
poses should build on each other across days. 
Mark which poses are for morning practice vs evening practice.""",
        "a5_focus": """Format the output as a structured multi-day wellness plan. 
Organize remedies into:
- Morning routine (herbs + yoga)
- Evening routine (acupressure + relaxation)
- Daily vs alternate day practices
Include a weekly schedule grid.""",
        "condition_prefix": "",
        "extra_inputs": ["duration_days"]
    },

    "dosage_calculator": {
        "label": "Dosage Calculator",
        "a1_focus": """Find herbs for the condition with detailed dosage information. 
For every herb include:
- Standard adult dose
- Weight-based dose formula
- Age adjustments (child, elderly)
- Maximum safe daily dose
- How long it takes to work""",
        "a2_focus": """Focus evidence search on dosage studies specifically. 
Look for clinical trials that specify exact doses used. 
Note the dose range used in studies vs traditional use doses.""",
        "a3_focus": """For yoga, specify exact duration and repetition counts. 
Not just hold times — include sets and total session length. 
For acupressure, specify exact pressure intensity (light/medium/firm) and session frequency.""",
        "a5_focus": """Write a dosage-focused report. 
Present herb dosages as a clear table:
- Herb name | Standard dose | Weight-based dose | Max dose | Timing
Include a warning about not exceeding maximum doses.""",
        "condition_prefix": "",
        "extra_inputs": ["age", "weight"]
    },

    "preparation_guide": {
        "label": "Preparation Guide",
        "a1_focus": """Find herbs for the condition and focus heavily on preparation methods. 
For each herb provide multiple preparation options:
- Tea/infusion method
- Tincture method  
- Topical application method
- Fresh vs dried herb differences
Include equipment needed and shelf life of each preparation.""",
        "a2_focus": """Check if preparation method affects efficacy. 
Look for studies comparing bioavailability of different preparations 
(e.g. tea vs tincture vs capsule). Note which preparation has the best evidence.""",
        "a3_focus": """For yoga, provide detailed step-by-step setup instructions 
as if teaching someone for the very first time. 
Include what to wear, room setup, props to gather before starting.""",
        "a5_focus": """Write a step-by-step preparation guide. 
Format each herb as a recipe card with:
- Ingredients list
- Equipment needed
- Step-by-step instructions (numbered)
- Storage instructions
- Shelf life
- How to tell if it has gone bad""",
        "condition_prefix": "",
        "extra_inputs": ["herb_name"]
    },

    "seasonal_remedies": {
        "label": "Seasonal Remedies",
        "a1_focus": """Find remedies specifically suited for the current season. 
Focus on:
- Herbs that are in season or traditionally used in this season
- Yoga practices suited to the season's energy (e.g. warming in winter, cooling in summer)
- Acupressure points traditionally used in this season in TCM""",
        "a2_focus": """Look for seasonal health research — 
studies on how the season affects the condition and 
which remedies work best during this time of year.""",
        "a3_focus": """Verify poses are appropriate for seasonal practice. 
In winter: warming, grounding poses. 
In summer: cooling, expansive poses.
Flag any pose that goes against seasonal energy principles.""",
        "a5_focus": """Write a seasonally-aware report. 
Open with a section on how this season affects the condition. 
Organize remedies with seasonal context — 
explain WHY each remedy is especially good for this time of year.""",
        "condition_prefix": "",
        "extra_inputs": ["season"]
    },

    "natural_beauty": {
        "label": "Natural Beauty",
        "a1_focus": """Find natural beauty remedies for the concern. Focus on:
- Herbs used topically for skin/hair/nails
- Preparation as face masks, hair oils, toners, scrubs
- Yoga poses that improve circulation and skin health
- Acupressure points linked to skin and beauty in TCM (face map points)""",
        "a2_focus": """Look for dermatological research on herbal cosmetics. 
Focus on clinical studies measuring skin outcomes 
(hydration, elasticity, acne reduction, brightening). 
Check for irritation or allergic reaction reports.""",
        "a3_focus": """For beauty-focused yoga, verify poses that: 
improve facial blood flow, reduce cortisol (which affects skin), 
and support lymphatic drainage. 
Flag any inversion that might not suit certain skin conditions.""",
        "a5_focus": """Write a natural beauty guide. 
Format herb section as DIY beauty recipes. 
Include a face map showing acupressure points. 
Add a morning beauty routine and evening skin ritual.""",
        "condition_prefix": "natural beauty concern:",
        "extra_inputs": ["beauty_concern"]
    },

    "sleep_optimizer": {
        "label": "Sleep Optimizer",
        "a1_focus": """Find remedies specifically for improving sleep quality. Focus on:
- Sedative and nervine herbs (valerian, passionflower, etc.)
- Yoga poses for evening/bedtime practice only
- Acupressure points for inducing sleep and reducing insomnia
- Preparation methods suitable for bedtime (teas, not tinctures with alcohol)""",
        "a2_focus": """Focus evidence search on sleep outcome measures:
- Sleep latency (time to fall asleep)
- Sleep duration
- Sleep quality scores (Pittsburgh Sleep Quality Index)
- REM sleep improvement
Prioritize human clinical trials over animal studies.""",
        "a3_focus": """Only verify CALMING, GROUNDING poses suitable for bedtime. 
Flag any energizing or stimulating poses as NOT appropriate. 
All poses should be done lying down or gently seated.""",
        "a5_focus": """Write a bedtime sleep optimization guide. 
Format as a step-by-step bedtime routine:
- 2 hours before bed
- 1 hour before bed  
- 30 minutes before bed
- In bed
Include a morning-after herb to support sleep cycle regulation.""",
        "condition_prefix": "sleep optimization and insomnia",
        "extra_inputs": []
    },

    "stress_relief": {
        "label": "Stress Relief",
        "a1_focus": """Find adaptogens and nervine herbs for stress relief. Focus on:
- Adaptogenic herbs (ashwagandha, rhodiola, holy basil)
- Calming herbs (chamomile, lemon balm, lavender)
- Yoga poses that activate the parasympathetic nervous system
- Acupressure points for cortisol reduction and nervous system calming""",
        "a2_focus": """Focus evidence on stress biomarkers:
- Cortisol level studies
- HRV (heart rate variability) improvement
- Anxiety scale scores (GAD-7, HAM-A)
- Self-reported stress reduction
Look for both acute (immediate) and chronic (long-term) stress relief evidence.""",
        "a3_focus": """Verify poses activate rest-and-digest response. 
Flag any pose that increases heart rate or is physically challenging — 
these are counterproductive for stress relief. 
Prioritize: forward folds, gentle twists, restorative poses, savasana.""",
        "a5_focus": """Write a stress relief protocol. 
Organize into:
- Quick relief (5 min — for acute stress moments)
- Daily practice (20 min — for chronic stress)
- Weekly deep reset (60 min — for burnout recovery)
Include a stress trigger journal prompt at the end.""",
        "condition_prefix": "stress, anxiety and nervous system regulation",
        "extra_inputs": []
    },

    "immunity_booster": {
        "label": "Immunity Booster",
        "a1_focus": """Find immune-supporting herbs, poses, and points. Focus on:
- Immunomodulatory herbs (echinacea, elderberry, astragalus)
- Herbs that reduce chronic inflammation
- Yoga poses that stimulate lymphatic flow
- Acupressure points in TCM associated with Wei Qi (defensive energy)""",
        "a2_focus": """Focus evidence on immune outcome measures:
- Cytokine studies
- White blood cell count changes
- Infection frequency/duration reduction
- Inflammatory marker studies (CRP, IL-6)
Distinguish between immune-stimulating and immune-modulating herbs.""",
        "a3_focus": """Verify poses stimulate lymphatic drainage. 
Good poses: inversions (if safe), twists, chest openers. 
For acupressure: confirm points are traditionally used for immune support 
and verify their locations on the meridian map.""",
        "a5_focus": """Write an immunity protocol. 
Organize into:
- Daily maintenance routine
- Acute immune boost (when feeling run down)
- Seasonal prevention protocol
Include a note on the difference between immune stimulation vs modulation.""",
        "condition_prefix": "immune system support and immunity",
        "extra_inputs": []
    },

    "breathing_test": {
        "label": "Breathing Test",
        "a1_focus": """Focus ONLY on breathing exercises (pranayama) and related practices.
Find:
- Pranayama techniques (Nadi Shodhana, Kapalabhati, Bhramari, etc.)
- Herbs that support respiratory health and lung function
- Acupressure points on the lung meridian (LU points)
Include breath ratios (inhale:hold:exhale counts) for each technique.""",
        "a2_focus": """Focus evidence on respiratory outcome measures:
- Lung capacity (FEV1, FVC)
- Oxygen saturation
- Anxiety and HRV improvement from breathwork
- Studies specifically on pranayama as intervention""",
        "a3_focus": """For breathing exercises, verify:
- Safe breath ratios for beginners
- Contraindications (some pranayama is unsafe for hypertension, pregnancy)
- Correct sitting posture for each technique
- When NOT to practice (full stomach, illness, etc.)""",
        "a5_focus": """Write a breathing practice guide. 
Format each technique as:
- Name + Sanskrit name
- When to use it (morning/stress/focus/sleep)
- Step-by-step breath instructions with counts
- Duration and rounds
- Benefits and contraindications
Include a beginner 7-day breath training schedule.""",
        "condition_prefix": "respiratory health and breathing",
        "extra_inputs": []
    },

    "home_remedies_plus": {
        "label": "Home Remedies+",
        "a1_focus": """Find remedies using ONLY ingredients available in a typical home kitchen. 
Focus on:
- Common kitchen herbs and spices (ginger, turmeric, garlic, honey, etc.)
- Simple preparation methods (no special equipment needed)
- Yoga poses anyone can do without props
- Acupressure points easy to self-administer
Every herb MUST be a common household ingredient.""",
        "a2_focus": """Focus evidence on commonly available kitchen ingredients. 
Look for clinical studies on:
- Ginger, turmeric, garlic, honey, cinnamon, clove, black pepper
- Simple food-based interventions
Note which remedies have the strongest kitchen-ingredient evidence base.""",
        "a3_focus": """Only verify poses that need NO equipment whatsoever. 
Can be done on carpet, in regular clothes, in a small room. 
Add modifications for people with no yoga experience at all.""",
        "a5_focus": """Write a home remedy guide using only kitchen ingredients. 
Format as simple recipes anyone can make right now. 
Add a WHAT YOU NEED section listing common pantry items. 
Include a quick-reference table: symptom → kitchen remedy.""",
        "condition_prefix": "",
        "extra_inputs": []
    },

    "exercise_planner": {
        "label": "Exercise Planner",
        "a1_focus": """Focus heavily on yoga asanas and physical movement. 
Find:
- A complete yoga sequence (warm-up → main poses → cool-down)
- Complementary herbs for muscle recovery and energy
- Acupressure points for muscle soreness and energy flow
Include intensity level (gentle/moderate/vigorous) for each pose.""",
        "a2_focus": """Focus evidence on yoga as physical exercise intervention:
- Flexibility improvement studies
- Strength and balance research
- Recovery and soreness reduction
- Energy and fatigue studies for herbs""",
        "a3_focus": """Design a progressive exercise sequence. 
Verify poses flow safely from one to the next. 
Check for:
- Warm-up adequacy before intense poses
- Cool-down sequence completeness
- Rest periods between challenging poses
Flag any sequence ordering that could cause injury.""",
        "a5_focus": """Write a structured exercise plan. 
Format as a complete workout session:
- Warm-up (5-10 min)
- Main sequence (20-30 min)  
- Cool-down (5-10 min)
Include sets, reps or hold times, rest periods.
Add beginner / intermediate / advanced variations for each pose.""",
        "condition_prefix": "",
        "extra_inputs": ["fitness_level"]
    },
}


def get_feature_prompt(feature_key: str) -> dict:
    """
    Returns the prompt config for a given feature.
    Falls back to wellness_search if feature not found.
    """
    return FEATURE_PROMPTS.get(feature_key, FEATURE_PROMPTS["wellness_search"])


def get_all_features() -> list:
    """
    Returns list of all features with their keys and labels.
    Used by the frontend sidebar.
    """
    return [
        {"key": k, "label": v["label"]}
        for k, v in FEATURE_PROMPTS.items()
    ]