# features/symptom_analyzer.py
import re
from utils.llm_routere import call_llm

SYSTEM = """You are a clinical symptom analyst.

Your job is to take a list of symptoms and identify the most likely condition.

STRICT RULES:
- Return ONLY a plain string — the condition name
- No JSON, no markdown, no explanation
- Be specific but concise (e.g. "tension headache", "IBS", "chronic anxiety")
- If symptoms suggest multiple conditions, pick the most prominent one
- Never diagnose serious conditions — map to general wellness conditions only
"""

def analyze(symptoms: str) -> str:
    """
    Takes raw symptom text and returns a condition string.
    This condition is then passed to A1 as the input.

    Example:
        Input:  "I have trouble sleeping, feel anxious, heart racing at night"
        Output: "anxiety-related insomnia"
    """
    print(f"[Symptom Analyzer] Analyzing: {symptoms}")

    user_prompt = f"""These are my symptoms: {symptoms}

What is the most likely wellness condition I should search remedies for?
Return ONLY the condition name, nothing else."""

    result = call_llm(
        primary="groq",
        system=SYSTEM,
        user=user_prompt
    )

    # Clean up any accidental punctuation or extra text
    condition = result.strip().strip(".")
    condition = re.sub(r"^(the condition is|condition:|likely condition:)\s*", "",
                       condition, flags=re.IGNORECASE)

    print(f"[Symptom Analyzer] Identified condition: {condition}")
    return condition