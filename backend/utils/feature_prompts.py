# utils/feature_prompts.py

FEATURE_PROMPTS = {

    # ── GROUP 1: Full 3-modality features ─────────────────────────────────────
    # Returns: herbs + yoga_poses + acupressure_points

    "wellness_search": {
        "label": "Wellness Search",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "",
        "extra_inputs": [],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "traditional_claim": "string"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "traditional_claim": "string"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "traditional_claim": "string"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 3-5, acupressure_points 3-5.""",

        "a1_focus": """Find a comprehensive mix of herbal remedies, yoga poses, and acupressure points
for the given condition. Cover all three modalities equally and thoroughly.
Be specific in preparation methods and point locations.""",

        "a2_focus": """Validate evidence across all three modalities equally.
Focus on peer-reviewed studies from the last 10 years where possible.
Assign evidence levels: strong / moderate / weak / none / contradicted.""",

        "a3_focus": """Verify safety and anatomy for general wellness use.
Add beginner-friendly modifications for all poses.
Confirm acupressure point locations match TCM references.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "how_to_use": "string",
        "dosage": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "yoga_routine": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time": "string",
        "modification": "string",
        "why_it_helps": "string"
      }
    ],
    "acupressure_guide": [
      {
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "how_often": "string",
        "why_it_helps": "string"
      }
    ],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a comprehensive wellness report covering all three modalities equally.
Make it easy for a complete beginner to follow.
Be honest about evidence levels.""",
    },

    "symptom_analyzer": {
        "label": "Symptom Analyzer",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "symptoms including",
        "extra_inputs": ["symptoms"],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "detected_root_cause": "string",
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "traditional_claim": "string",
      "targets_symptom": "string"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "traditional_claim": "string",
      "targets_symptom": "string"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "traditional_claim": "string",
      "targets_symptom": "string"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 3-5, acupressure_points 3-5.
Each item MUST include which specific symptom it targets.""",

        "a1_focus": """The condition is derived from user symptoms.
Find remedies specifically targeting the ROOT CAUSES of these symptoms.
For every herb, pose, and point — clearly state which symptom it addresses.
Include remedies that address multiple symptoms at once where possible.""",

        "a2_focus": """Focus evidence validation on symptom-relief research.
Look for studies that measured specific symptom reduction as outcomes.
Note which symptoms each remedy has the most evidence for.""",

        "a3_focus": """Pay extra attention to contraindications.
Symptom-based conditions may have underlying causes that make certain poses unsafe.
Flag anything that could worsen symptoms.
Add safe alternatives for any flagged poses.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "detected_root_cause": "string",
    "bottom_line": "string",
    "herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "how_to_use": "string",
        "dosage": "string",
        "targets_symptom": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "yoga_routine": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time": "string",
        "targets_symptom": "string",
        "modification": "string",
        "why_it_helps": "string"
      }
    ],
    "acupressure_guide": [
      {
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "targets_symptom": "string",
        "why_it_helps": "string"
      }
    ],
    "symptom_tracking_tip": "string",
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write the report from a symptom-relief perspective.
For every remedy explain exactly which symptom it addresses and how.
Include a symptom tracking tip at the end.
Be clear about which remedies have the strongest evidence.""",
    },

    "seasonal_remedies": {
        "label": "Seasonal Remedies",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "",
        "extra_inputs": ["season"],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "season": "string",
  "seasonal_context": "string",
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "traditional_claim": "string",
      "why_seasonal": "string"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "traditional_claim": "string",
      "seasonal_benefit": "string"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "traditional_claim": "string",
      "tcm_seasonal_use": "string"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 3-5, acupressure_points 3-5.
Every item MUST explain its seasonal relevance.""",

        "a1_focus": """Find remedies specifically suited for the current season.
Every herb must be traditionally used in this season.
Yoga practices must match the season's energy (warming in winter, cooling in summer).
Acupressure points must be those traditionally used in this season in TCM.
Explain WHY each remedy is specifically good for this season.""",

        "a2_focus": """Look for seasonal health research.
Find studies on how the season affects the condition.
Note which remedies have evidence specifically for seasonal use.""",

        "a3_focus": """Verify poses are appropriate for seasonal practice.
Winter: warming, grounding poses only.
Summer: cooling, expansive poses only.
Spring: detoxifying, energizing poses.
Autumn: grounding, nourishing poses.
Flag any pose that goes against seasonal energy principles.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "season": "string",
    "seasonal_health_context": "string",
    "bottom_line": "string",
    "herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "how_to_use": "string",
        "dosage": "string",
        "why_perfect_for_this_season": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "yoga_routine": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time": "string",
        "seasonal_benefit": "string",
        "modification": "string"
      }
    ],
    "acupressure_guide": [
      {
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "tcm_seasonal_significance": "string"
      }
    ],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a seasonally-aware report.
Open with how this season affects the body and condition.
For every remedy explain WHY it is especially good for this time of year.
Use seasonal language throughout — warming, cooling, grounding, cleansing.""",
    },

    "natural_beauty": {
        "label": "Natural Beauty",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "natural beauty concern:",
        "extra_inputs": ["beauty_concern"],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "beauty_concern": "string",
  "herbs": [
    {
      "name": "string",
      "application_method": "string",
      "recipe": "string",
      "frequency": "string",
      "skin_hair_benefit": "string"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "beauty_benefit": "string"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "face_location": "string",
      "pressure_technique": "string",
      "duration": "string",
      "beauty_benefit": "string"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 3-4, acupressure_points 4-5.
Herbs are TOPICAL only — not for ingestion.
Poses must improve circulation, reduce cortisol, or support lymphatic drainage.
Acupressure points must be on the face or head (face map points).""",

        "a1_focus": """Find TOPICAL herbal beauty remedies for the skin/hair concern.
Herbs must be for external use — face masks, serums, hair oils, scrubs.
Yoga poses must specifically improve facial blood flow or skin health.
Acupressure points must be on the face/head — traditional beauty points.
Include DIY recipe for every herb.""",

        "a2_focus": """Look for dermatological research on herbal cosmetics.
Focus on clinical studies measuring skin outcomes:
hydration, elasticity, acne reduction, brightening, hair growth.
Check for skin irritation or allergic reaction reports.
Flag anything with known sensitization risk.""",

        "a3_focus": """For beauty yoga, verify poses that:
improve facial blood flow, reduce cortisol, support lymphatic drainage.
Flag any inversion that might worsen certain skin conditions (rosacea, acne).
Confirm face acupressure points match traditional face map references.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "beauty_concern": "string",
    "bottom_line": "string",
    "diy_beauty_recipes": [
      {
        "herb_name": "string",
        "evidence_level": "string",
        "recipe_name": "string",
        "ingredients": "string",
        "how_to_make": "string",
        "how_to_apply": "string",
        "frequency": "string",
        "skin_benefit": "string",
        "patch_test_required": true,
        "who_should_avoid": "string"
      }
    ],
    "beauty_yoga_routine": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time": "string",
        "beauty_benefit": "string",
        "modification": "string"
      }
    ],
    "face_acupressure_guide": [
      {
        "point_name": "string",
        "face_location": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "beauty_benefit": "string"
      }
    ],
    "morning_beauty_routine": "string",
    "evening_skin_ritual": "string",
    "general_safety_warning": "string"
  }
}""",

        "a5_focus": """Write a natural beauty guide with DIY recipes.
Format every herb as a recipe card with exact ingredients and steps.
Include a morning beauty routine and evening skin ritual.
Always note patch test requirement for topical applications.
Be clear about which ingredients to avoid for sensitive skin.""",
    },

    "sleep_optimizer": {
        "label": "Sleep Optimizer",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "sleep optimization and insomnia",
        "extra_inputs": [],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "best_time_to_take": "string",
      "sleep_mechanism": "string"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "when_in_routine": "string",
      "sleep_benefit": "string"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "sleep_benefit": "string"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 3-5, acupressure_points 3-4.
Herbs: sedative/nervine only, NO alcohol-based tinctures, bedtime teas preferred.
Poses: calming/grounding ONLY — lying down or gently seated.
NO energizing poses (no backbends, no inversions, no vigorous sequences).
Each pose must include when in the bedtime routine to practice it.""",

        "a1_focus": """Find ONLY sleep-specific remedies.
Herbs must be sedative or nervine — valerian, passionflower, ashwagandha, chamomile.
Poses must be suitable for bedtime — restorative, yin, gentle.
Acupressure points must specifically induce sleep or reduce insomnia.
Include the exact TIME in the bedtime routine for each practice.""",

        "a2_focus": """Focus ONLY on sleep outcome measures in research:
sleep latency (time to fall asleep), sleep duration, sleep quality scores,
REM sleep improvement, Pittsburgh Sleep Quality Index scores.
Reject any herb that has stimulating side effects.
Prioritize human clinical trials over animal studies.""",

        "a3_focus": """STRICTLY verify only calming, grounding poses.
Immediately flag and remove any energizing or stimulating poses.
ALL poses must be suitable for someone lying in bed or sitting quietly.
Verify no poses raise heart rate or require balance/strength.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "sleep_herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "how_to_prepare": "string",
        "dosage": "string",
        "when_to_take": "string",
        "how_it_helps_sleep": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "bedtime_routine": [
      {
        "time_before_bed": "string",
        "activity_type": "herb|pose|acupressure",
        "name": "string",
        "instructions": "string",
        "duration": "string",
        "why_at_this_time": "string"
      }
    ],
    "acupressure_guide": [
      {
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "how_it_induces_sleep": "string"
      }
    ],
    "morning_after_tip": "string",
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a bedtime sleep optimization guide.
The bedtime_routine must be organized chronologically:
2 hours before bed → 1 hour before → 30 minutes before → in bed.
Every item must explain WHY it is done at that specific time.
Include a morning-after herb to support sleep cycle regulation.""",
    },

    "stress_relief": {
        "label": "Stress Relief",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "stress, anxiety and nervous system regulation",
        "extra_inputs": [],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "stress_mechanism": "string",
      "onset_time": "string"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "nervous_system_effect": "string"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "cortisol_effect": "string"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 3-5, acupressure_points 3-4.
Herbs: adaptogens and nervines ONLY — ashwagandha, rhodiola, holy basil, lemon balm.
Poses: parasympathetic-activating ONLY — forward folds, gentle twists, restorative poses.
NO vigorous or challenging poses.
Each herb must include how long before stress relief kicks in (onset time).""",

        "a1_focus": """Find ONLY stress and nervous system specific remedies.
Herbs must be adaptogens or nervines — explain the cortisol/HRV mechanism.
Poses must activate the parasympathetic (rest-and-digest) nervous system.
Acupressure points must have traditional use for calming and stress reduction.
Include onset time for each herb (immediate vs days vs weeks).""",

        "a2_focus": """Focus evidence on stress biomarkers:
cortisol level studies, HRV improvement, GAD-7/HAM-A anxiety scale scores.
Distinguish between acute stress relief (immediate) and chronic stress relief (long-term).
Look for studies that measured both physiological AND psychological outcomes.""",

        "a3_focus": """Verify poses activate rest-and-digest response.
Flag and remove any pose that raises heart rate or is physically challenging.
Prioritize: yin poses, restorative poses, forward folds, savasana variations.
Confirm acupressure points are correctly located on stress-relief meridians.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "stress_herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "how_to_use": "string",
        "dosage": "string",
        "onset_time": "string",
        "how_it_reduces_stress": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "quick_relief_5min": [
      {
        "name": "string",
        "type": "pose|acupressure|breathing",
        "instructions": "string",
        "duration": "string",
        "why_it_works_fast": "string"
      }
    ],
    "daily_practice_20min": [
      {
        "name": "string",
        "type": "pose|herb|acupressure",
        "instructions": "string",
        "duration": "string"
      }
    ],
    "acupressure_guide": [
      {
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "cortisol_effect": "string"
      }
    ],
    "stress_journal_prompt": "string",
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a stress relief protocol organized by urgency:
quick_relief_5min: for acute stress moments right now.
daily_practice_20min: for chronic stress management.
Make the quick relief section immediately actionable — someone in stress right now.
Include a stress trigger journal prompt at the end.""",
    },

    "immunity_booster": {
        "label": "Immunity Booster",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "immune system support and immunity",
        "extra_inputs": [],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "immune_mechanism": "string",
      "type": "stimulating|modulating|anti-inflammatory"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "lymphatic_benefit": "string"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "immune_benefit": "string"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 3-5, acupressure_points 3-4.
Herbs: immunomodulatory focus — echinacea, elderberry, astragalus, turmeric, reishi.
Poses: lymphatic drainage focus — inversions, twists, chest openers.
Points: Traditional TCM Wei Qi (defensive energy) points only.
Each herb must specify whether it is stimulating or modulating.""",

        "a1_focus": """Find ONLY immune-system specific remedies.
Herbs must explicitly support the immune system — specify stimulating vs modulating.
Poses must stimulate lymphatic flow or support immune function.
Acupressure points must be traditional TCM points for Wei Qi (defensive energy).
Include the exact immune mechanism for every herb.""",

        "a2_focus": """Focus evidence on immune outcome measures:
cytokine studies, white blood cell count changes, infection frequency/duration reduction,
inflammatory marker studies (CRP, IL-6).
MUST distinguish between immune stimulation (short-term) vs modulation (long-term).
Flag any herb that could cause autoimmune issues if overused.""",

        "a3_focus": """Verify poses stimulate lymphatic drainage.
Confirm inversions are safe before including them.
For acupressure: verify points are correctly located on immune meridians.
Flag any herb contraindicated for autoimmune conditions.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "immune_herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "type": "stimulating|modulating|anti-inflammatory",
        "how_to_use": "string",
        "dosage": "string",
        "immune_mechanism": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "daily_maintenance": [
      {
        "name": "string",
        "type": "herb|pose|acupressure",
        "instructions": "string",
        "duration": "string"
      }
    ],
    "acute_immune_boost": [
      {
        "name": "string",
        "type": "herb|pose|acupressure",
        "instructions": "string",
        "duration": "string",
        "when_to_use": "string"
      }
    ],
    "lymphatic_yoga_routine": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time": "string",
        "lymphatic_benefit": "string",
        "modification": "string"
      }
    ],
    "acupressure_guide": [
      {
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "immune_benefit": "string"
      }
    ],
    "stimulation_vs_modulation_note": "string",
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write an immunity protocol organized into three tiers:
daily_maintenance: what to do every day to stay healthy.
acute_immune_boost: what to do when feeling run down or getting sick.
Include a clear note explaining the difference between immune stimulation and modulation.
Be specific about who should NOT use immune-stimulating herbs (autoimmune conditions).""",
    },

    "home_remedies_plus": {
        "label": "Home Remedies+",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "",
        "extra_inputs": [],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "herbs": [
    {
      "ingredient": "string",
      "recipe_name": "string",
      "ingredients_needed": "string",
      "preparation": "string",
      "dosage": "string",
      "traditional_claim": "string"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "traditional_claim": "string"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "traditional_claim": "string"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 3-4, acupressure_points 3-4.
ALL ingredients must be common kitchen pantry items ONLY.
NO special herbs, supplements, or equipment.
Only: ginger, turmeric, garlic, honey, cinnamon, clove, black pepper, lemon, salt, etc.
Poses must require ZERO equipment — can be done on carpet in regular clothes.
Include a recipe name for each kitchen remedy.""",

        "a1_focus": """Find remedies using ONLY common kitchen pantry ingredients.
Every ingredient must be something found in a typical kitchen.
Absolutely NO special herbs, supplements, or equipment.
Simple preparation — someone with no cooking skills can make these.
Yoga poses must require zero equipment — carpet and regular clothes only.""",

        "a2_focus": """Focus evidence on commonly available kitchen ingredients only.
Look for clinical studies specifically on: ginger, turmeric, garlic, honey,
cinnamon, clove, black pepper, lemon, salt.
Note which kitchen remedies have the strongest evidence base.""",

        "a3_focus": """Only verify poses that need ZERO equipment.
Must be doable on carpet in regular clothes in a small room.
Add extra-simple modifications for people with no yoga experience.
Confirm acupressure points are easy to self-administer.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "pantry_checklist": ["string"],
    "kitchen_remedy_recipes": [
      {
        "ingredient": "string",
        "evidence_level": "string",
        "recipe_name": "string",
        "what_you_need": "string",
        "step_by_step": "string",
        "dosage": "string",
        "why_it_helps": "string",
        "safety_notes": "string"
      }
    ],
    "yoga_routine": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time": "string",
        "modification": "string",
        "why_it_helps": "string"
      }
    ],
    "acupressure_guide": [
      {
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "why_it_helps": "string"
      }
    ],
    "quick_reference_table": [
      {
        "symptom": "string",
        "kitchen_remedy": "string"
      }
    ],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a home remedy guide using only kitchen ingredients.
pantry_checklist: list all ingredients needed so user can check their kitchen.
Format every remedy as a simple recipe anyone can make right now.
quick_reference_table: one-line symptom → kitchen remedy lookup table.
Keep language simple — no medical jargon.""",
    },

    "wellness_plan": {
        "label": "Wellness Plan",
        "group": "full",
        "skip_a3": False,
        "condition_prefix": "",
        "extra_inputs": ["duration_days"],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "traditional_claim": "string",
      "safe_for_daily_use": true,
      "best_time": "morning|evening|both"
    }
  ],
  "yoga_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "traditional_claim": "string",
      "practice_time": "morning|evening|both"
    }
  ],
  "acupressure_points": [
    {
      "point_name": "string",
      "location_description": "string",
      "pressure_technique": "string",
      "duration": "string",
      "traditional_claim": "string",
      "practice_time": "morning|evening|both"
    }
  ]
}
Rules: herbs exactly 5, yoga_poses 4-6, acupressure_points 3-5.
ALL remedies must be safe for daily long-term use.
Every item must specify best_time or practice_time (morning/evening/both).
Focus on remedies that complement each other as a complete daily system.""",

        "a1_focus": """Find remedies that work together as a DAILY SYSTEM.
Every remedy must be safe for long-term daily use.
Herbs, poses, and points must complement each other.
Mark each item as morning, evening, or both.
Focus on building a complete morning + evening routine.""",

        "a2_focus": """Focus on evidence for long-term and repeated use.
Look for studies on sustained use over weeks or months.
MUST flag any remedy that should NOT be used daily long-term.
Note any herbs that need cycling (take breaks from periodically).""",

        "a3_focus": """Design a progressive yoga sequence.
Poses should build on each other across days.
Clearly mark morning vs evening poses.
Add modifications for beginners who may be stiff in the morning.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "how_to_use": "string",
        "dosage": "string",
        "best_time": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "yoga_routine": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time": "string",
        "practice_time": "string",
        "modification": "string",
        "why_it_helps": "string"
      }
    ],
    "acupressure_guide": [
      {
        "point_name": "string",
        "where_to_find_it": "string",
        "how_to_apply": "string",
        "how_long": "string",
        "practice_time": "string",
        "why_it_helps": "string"
      }
    ],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a wellness plan report.
Every herb, pose, and acupressure point must include its best practice time.
The post-processing wellness_plan.py will then organize this into a day-by-day schedule.
Be clear about which remedies are morning vs evening.""",
    },

    # ── GROUP 2: Herbs only features ──────────────────────────────────────────
    # Returns: herbs only — no yoga poses, no acupressure points
    # A3 is skipped for these features

    "safety_check": {
        "label": "Safety Check",
        "group": "herbs_only",
        "skip_a3": True,
        "condition_prefix": "",
        "extra_inputs": ["age", "weight", "medications"],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "patient_profile": {
    "age": "string",
    "weight": "string",
    "medications": "string"
  },
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "standard_dosage": "string",
      "traditional_claim": "string",
      "known_drug_interactions": "string",
      "contraindicated_for": "string",
      "safety_rating": "very_safe|generally_safe|use_with_caution|avoid"
    }
  ]
}
Rules: herbs exactly 5.
NO yoga poses, NO acupressure points — herbs ONLY.
Every herb MUST include known_drug_interactions and contraindicated_for.
Safety rating is REQUIRED for every herb.
Only include herbs with well-established safety profiles.""",

        "a1_focus": """Find the 5 SAFEST herbal remedies for this condition.
Focus exclusively on herbs with well-established safety profiles.
For every herb document: drug interactions, contraindications, safety rating.
Consider the patient's age, weight, and current medications.
SKIP yoga poses and acupressure — this feature is herbs-only.""",

        "a2_focus": """Prioritize SAFETY evidence above efficacy evidence.
For every herb look specifically for:
drug interaction studies, contraindication research,
studies on safety in specific populations (elderly, pregnant, children).
Assign safety rating based on evidence: very_safe / generally_safe / use_with_caution / avoid.
Flag ANYTHING with moderate or higher risk for this patient profile.""",

        "a3_focus": "SKIP — this feature does not include yoga poses.",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "patient_profile_summary": "string",
    "bottom_line": "string",
    "safety_rated_herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "safety_rating": "very_safe|generally_safe|use_with_caution|avoid",
        "how_to_use": "string",
        "dosage_for_this_profile": "string",
        "drug_interactions": "string",
        "who_must_avoid": "string",
        "special_notes_for_age_weight": "string"
      }
    ],
    "medication_interaction_table": [
      {
        "herb": "string",
        "interacts_with": "string",
        "interaction_type": "string",
        "severity": "mild|moderate|severe"
      }
    ],
    "safest_options": ["string"],
    "herbs_to_avoid_for_this_profile": ["string"],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a safety-first report for this specific patient profile.
Lead every section with safety warnings before benefits.
medication_interaction_table: list every known interaction clearly.
safest_options: the top 2-3 herbs safest for this specific age/weight/medication profile.
herbs_to_avoid_for_this_profile: what NOT to take and why.
Never recommend anything rated use_with_caution without a strong warning.""",
    },

    "dosage_calculator": {
        "label": "Dosage Calculator",
        "group": "herbs_only",
        "skip_a3": True,
        "condition_prefix": "",
        "extra_inputs": ["age", "weight"],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "standard_adult_dose": "string",
      "traditional_claim": "string",
      "dose_form": "tea|tincture|capsule|powder|extract",
      "max_daily_dose": "string",
      "timing": "string",
      "how_long_to_work": "string"
    }
  ]
}
Rules: herbs exactly 5.
NO yoga poses, NO acupressure points — herbs with dosage info ONLY.
Every herb MUST include: standard_adult_dose, max_daily_dose, timing, how_long_to_work.
Include specific dose form (tea/tincture/capsule/powder/extract).""",

        "a1_focus": """Find the 5 best herbs for this condition with DETAILED dosage information.
For every herb you MUST include:
- Standard adult dose with units (mg, ml, cups, etc.)
- Maximum safe daily dose
- Best timing (with food, before bed, morning, etc.)
- How long until effects are felt
SKIP yoga poses and acupressure — this feature is dosage-focused herbs only.""",

        "a2_focus": """Focus evidence search on DOSAGE STUDIES specifically.
Look for clinical trials that specify exact doses used.
Note the dose range used in studies vs traditional use doses.
Flag any discrepancy between study doses and traditional doses.""",

        "a3_focus": "SKIP — this feature does not include yoga poses.",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "dosage_table": [
      {
        "herb_name": "string",
        "evidence_level": "string",
        "standard_adult_dose": "string",
        "personalized_dose": "string",
        "max_daily_dose": "string",
        "dose_form": "string",
        "timing": "string",
        "how_long_to_work": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "dosage_notes": "string",
    "important_warnings": "string",
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a dosage-focused report.
dosage_table: clear table with every dosage detail for each herb.
personalized_dose will be calculated by dosage_calculator.py post-processor.
Include clear warnings about not exceeding maximum doses.
Explain what happens if doses are missed or doubled.""",
    },

    "preparation_guide": {
        "label": "Preparation Guide",
        "group": "herbs_only",
        "skip_a3": True,
        "condition_prefix": "",
        "extra_inputs": ["herb_name"],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "herbs": [
    {
      "name": "string",
      "traditional_claim": "string",
      "best_preparation_method": "tea|tincture|oil|capsule|topical|decoction",
      "alternative_methods": "string",
      "fresh_vs_dried": "string",
      "standard_dosage": "string",
      "equipment_needed": "string",
      "shelf_life": "string"
    }
  ]
}
Rules: herbs exactly 5 (or 1 if specific herb requested).
NO yoga poses, NO acupressure — preparation-focused herbs ONLY.
Every herb MUST include: best_preparation_method, fresh_vs_dried, equipment_needed, shelf_life.
Focus on HOW to prepare, not just what it does.""",

        "a1_focus": """Find herbs for this condition focusing HEAVILY on preparation methods.
For every herb provide the BEST preparation method for home use.
Include fresh vs dried herb differences.
List exact equipment needed.
SKIP yoga poses and acupressure — this feature is preparation-focused herbs only.""",

        "a2_focus": """Check if preparation method affects efficacy.
Look for studies comparing bioavailability of different preparations:
tea vs tincture vs capsule vs powder.
Note which preparation has the best clinical evidence.
Flag any preparation that destroys active compounds (e.g. boiling some herbs).""",

        "a3_focus": "SKIP — this feature does not include yoga poses.",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "preparation_guides": [
      {
        "herb_name": "string",
        "evidence_level": "string",
        "best_preparation": "string",
        "why_this_method": "string",
        "ingredients": [
          {"item": "string", "quantity": "string"}
        ],
        "equipment": ["string"],
        "step_by_step": [
          {"step": 1, "instruction": "string", "duration": "string", "tip": "string"}
        ],
        "dosage": "string",
        "storage_instructions": "string",
        "shelf_life": "string",
        "how_to_tell_if_bad": "string",
        "best_time_to_use": "string",
        "safety_notes": "string",
        "who_should_avoid": "string"
      }
    ],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write step-by-step preparation guides — like recipe cards.
Every herb gets a full recipe card with exact quantities and numbered steps.
Include storage instructions and shelf life for every preparation.
Explain how to tell if the preparation has gone bad.
Keep instructions simple enough for someone who has never made herbal remedies before.""",
    },

    # ── GROUP 3: Completely different schema features ─────────────────────────

    "breathing_test": {
        "label": "Breathing Test",
        "group": "breathing",
        "skip_a3": True,
        "condition_prefix": "respiratory health and breathing",
        "extra_inputs": [],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "breathing_techniques": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "type": "energizing|calming|balancing|cleansing",
      "inhale_count": "string",
      "hold_count": "string",
      "exhale_count": "string",
      "rounds": "string",
      "total_duration_minutes": "string",
      "best_time": "morning|stress|focus|sleep|anytime",
      "sitting_posture": "string",
      "traditional_benefit": "string",
      "contraindications": "string"
    }
  ],
  "herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "respiratory_benefit": "string"
    }
  ]
}
Rules: breathing_techniques exactly 5, lung_herbs exactly 3.
NO yoga poses, NO general acupressure — breathing techniques ONLY with lung herbs.
Every technique MUST include exact breath ratio (inhale:hold:exhale counts).
Every technique MUST include contraindications.
Herbs must be lung/respiratory specific ONLY.""",

        "a1_focus": """Find ONLY pranayama breathing techniques and lung support herbs.
NO yoga poses, NO acupressure points.
5 breathing techniques with exact breath ratios (inhale:hold:exhale counts).
3 herbs specifically for lung and respiratory health.
Every technique must include when to use it and exact contraindications.""",

        "a2_focus": """Focus evidence on respiratory outcome measures ONLY:
lung capacity (FEV1, FVC), oxygen saturation, HRV improvement from breathwork.
Look for studies specifically on pranayama as intervention.
For herbs: look for respiratory/lung-specific studies only.""",

        "a3_focus": "SKIP — this feature uses breathing techniques, not yoga poses.",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "bottom_line": "string",
    "breathing_technique_guides": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "evidence_level": "string",
        "type": "energizing|calming|balancing|cleansing",
        "when_to_use": "string",
        "sitting_posture": "string",
        "breath_ratio": "string",
        "step_by_step": "string",
        "rounds": "string",
        "total_duration": "string",
        "benefits": "string",
        "contraindications": "string",
        "beginner_tip": "string"
      }
    ],
    "herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "how_to_use": "string",
        "dosage": "string",
        "respiratory_benefit": "string",
        "safety_notes": "string"
      }
    ],
    "seven_day_schedule": [
      {
        "day": "string",
        "technique": "string",
        "duration_minutes": "string",
        "focus": "string"
      }
    ],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a complete breathing practice guide.
breathing_technique_guides: full instructions with exact breath counts for each technique.
seven_day_schedule: progressive 7-day training schedule from beginner to full practice.
herbs: only 3 herbs, respiratory-specific.
Be very clear about contraindications — some pranayama is dangerous for hypertension.""",
    },

    "exercise_planner": {
        "label": "Exercise Planner",
        "group": "exercise",
        "skip_a3": False,
        "condition_prefix": "",
        "extra_inputs": ["fitness_level"],

        "a1_schema": """Return this exact JSON schema:
{
  "condition": "string",
  "fitness_level": "string",
  "warmup_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "warmup_purpose": "string",
      "intensity": "gentle"
    }
  ],
  "main_sequence_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "sets_reps": "string",
      "intensity": "moderate|vigorous",
      "beginner_variation": "string",
      "advanced_variation": "string"
    }
  ],
  "cooldown_poses": [
    {
      "name": "string",
      "sanskrit_name": "string",
      "alignment_cues": "string",
      "duration": "string",
      "recovery_purpose": "string",
      "intensity": "gentle"
    }
  ],
  "recovery_herbs": [
    {
      "name": "string",
      "preparation": "string",
      "dosage": "string",
      "recovery_benefit": "string"
    }
  ]
}
Rules: warmup_poses 3-4, main_sequence_poses 5-7, cooldown_poses 3-4, recovery_herbs 3.
NO acupressure — yoga sequence + recovery herbs ONLY.
Every main pose MUST include beginner_variation and advanced_variation.
Poses must flow safely from warmup → main → cooldown.
Recovery herbs for muscle recovery and energy only.""",

        "a1_focus": """Design a COMPLETE yoga workout sequence split into 3 phases:
warmup (gentle, 5-10 min), main sequence (moderate/vigorous, 20-30 min), cooldown (gentle, 5-10 min).
3 recovery herbs for muscle recovery and energy.
NO general acupressure — this is an exercise session, not a wellness check.
Every main pose must have beginner AND advanced variations.
Poses must flow safely from one to the next.""",

        "a2_focus": """Focus evidence on yoga as PHYSICAL EXERCISE:
flexibility improvement, strength and balance, recovery and soreness reduction.
For recovery herbs: look for muscle recovery and anti-inflammatory studies.
Note intensity levels supported by evidence.""",

        "a3_focus": """Design a SAFE progressive exercise sequence.
Verify poses flow safely from warmup to main to cooldown.
Check warmup adequacy before intense poses.
Check cooldown completeness — no abrupt ending.
Flag any dangerous sequence ordering that could cause injury.
Verify beginner variations are actually suitable for beginners.""",

        "a5_schema": """Return this exact JSON schema:
{
  "report": {
    "condition": "string",
    "fitness_level": "string",
    "bottom_line": "string",
    "total_duration_minutes": "string",
    "warmup": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "duration": "string",
        "warmup_purpose": "string"
      }
    ],
    "main_sequence": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "hold_time_or_reps": "string",
        "sets": "string",
        "beginner_variation": "string",
        "advanced_variation": "string",
        "why_it_helps": "string"
      }
    ],
    "cooldown": [
      {
        "name": "string",
        "sanskrit_name": "string",
        "how_to_do": "string",
        "duration": "string",
        "recovery_purpose": "string"
      }
    ],
    "recovery_herbs": [
      {
        "name": "string",
        "evidence_level": "string",
        "how_to_use": "string",
        "dosage": "string",
        "when_to_take": "string",
        "recovery_benefit": "string",
        "safety_notes": "string"
      }
    ],
    "general_safety_warning": "string",
    "when_to_see_doctor": "string"
  }
}""",

        "a5_focus": """Write a structured exercise plan with 3 clear phases:
warmup → main_sequence → cooldown.
main_sequence: include sets, hold time or reps, and both beginner and advanced variations.
recovery_herbs: only 3 herbs, when to take them (before/during/after exercise).
total_duration_minutes: sum of all phases.
Keep instructions clear enough for someone to follow without a trainer.""",
    },
}


def get_feature_prompt(feature_key: str) -> dict:
    """Returns the prompt config for a given feature.
    Falls back to wellness_search if feature not found."""
    return FEATURE_PROMPTS.get(feature_key, FEATURE_PROMPTS["wellness_search"])


def get_feature_group(feature_key: str) -> str:
    """Returns the group for a feature.
    Groups: full | herbs_only | breathing | exercise"""
    return FEATURE_PROMPTS.get(feature_key, {}).get("group", "full")


def should_skip_a3(feature_key: str) -> bool:
    """Returns True if A3 should be skipped for this feature."""
    return FEATURE_PROMPTS.get(feature_key, {}).get("skip_a3", False)


def get_all_features() -> list:
    """Returns list of all features with their keys and labels."""
    return [
        {"key": k, "label": v["label"]}
        for k, v in FEATURE_PROMPTS.items()
    ]