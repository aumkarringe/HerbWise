# utils/input_validator.py
import re
from utils.llm_routere import call_llm

# ─── Emergency Keywords ────────────────────────────────────────────────────────
# Block completely, show crisis resources, never enter pipeline
EMERGENCY_KEYWORDS = [
    "suicidal", "suicide", "kill myself", "end my life",
    "self harm", "self-harm", "cutting myself",
    "want to die", "dying right now", "overdose on purpose",
    "hurt myself", "harming myself", "take my own life",
    "end it all", "not want to live", "don't want to live",
    "dont want to live", "no reason to live",
    "better off dead", "wish i was dead"
]

# ─── Serious / Emergency Medical Symptoms ─────────────────────────────────────
# Block pipeline, tell user to go to ER — NOT for herbal remedies
SERIOUS_SYMPTOMS = [
    # Cardiac
    "chest pain", "heart attack", "cardiac arrest", "heart failure",
    "severe chest pressure", "crushing chest", "jaw pain with sweat",
    "arm pain with chest", "palpitation with fainting",

    # Respiratory
    "difficulty breathing", "shortness of breath", "cant breathe",
    "can't breathe", "cannot breathe", "stopped breathing",
    "not breathing", "respiratory failure",

    # Neurological
    "stroke", "face drooping", "sudden numbness", "slurred speech",
    "sudden confusion", "sudden severe headache", "loss of vision",
    "vision loss", "sudden blindness", "seizure", "convulsion",
    "paralysis", "cant move", "can't move", "brain bleed",

    # Bleeding / Trauma
    "severe bleeding", "bleeding heavily", "coughing blood",
    "vomiting blood", "blood in stool", "internal bleeding",
    "severe burn", "broken bone", "fracture", "spinal injury",
    "severe head trauma", "head injury",

    # Loss of consciousness
    "unconscious", "passing out", "loss of consciousness",
    "collapsed", "fainted",

    # Poisoning / Overdose
    "poisoning", "overdose", "accidental overdose",

    # Infection / systemic
    "anaphylaxis", "severe allergic reaction",
    "high fever with stiff neck", "meningitis",
    "diabetic coma", "insulin shock",

    # Abdominal
    "severe abdominal pain",
]

# ─── Sensitive Mental Health ───────────────────────────────────────────────────
# Block pipeline — these need professional care, not herbal remedies
SENSITIVE_BLOCK = [
    "depression", "clinical depression", "major depression",
    "bipolar disorder", "schizophrenia", "psychosis",
    "eating disorder", "anorexia", "bulimia",
    "ptsd", "post traumatic", "dissociation", "dissociative",
    "borderline personality", "narcissistic personality",
    "paranoia", "paranoid", "hallucination", "hallucinating",
    "substance abuse", "alcohol addiction", "drug addiction",
    "heroin", "cocaine", "methamphetamine",
    "ocd with intrusive", "psychotic episode",
]

# ─── Blocked: Professions ─────────────────────────────────────────────────────
BLOCKED_PROFESSIONS = [
    "software engineer", "software developer", "web developer",
    "frontend engineer", "backend engineer", "full stack engineer",
    "programmer", "coder", "data scientist", "ml engineer",
    "teacher", "professor", "instructor", "educator",
    "lawyer", "attorney", "paralegal", "judge",
    "doctor", "physician", "nurse", "pharmacist",
    "dentist", "surgeon", "therapist as job",
    "chef", "cook", "baker", "barista",
    "manager", "director", "executive", "ceo", "cto", "cfo",
    "accountant", "auditor", "financial analyst",
    "architect", "civil engineer", "mechanical engineer",
    "graphic designer", "ux designer", "ui designer",
    "musician", "singer", "actor", "actress", "model",
    "police officer", "firefighter", "soldier", "military",
    "pilot", "flight attendant", "driver", "electrician",
    "plumber", "carpenter", "mechanic", "technician",
    "scientist", "researcher", "biologist", "chemist",
    "consultant", "analyst", "intern", "freelancer",
]

# ─── Blocked: Greetings / Random words ────────────────────────────────────────
BLOCKED_EXACT_WORDS = {
    "hello", "hi", "hey", "bye", "goodbye", "good morning",
    "good night", "good evening", "ok", "okay", "k", "kk",
    "yes", "no", "nope", "yep", "yeah", "nah", "nah",
    "maybe", "sure", "fine", "alright", "cool", "great",
    "test", "testing", "check", "checking", "demo", "sample",
    "nothing", "anything", "everything", "something", "none",
    "idk", "idc", "lol", "lmao", "lmfao", "rofl", "rotfl",
    "wtf", "omg", "omfg", "smh", "bruh", "bro", "sis",
    "haha", "hehe", "hm", "hmm", "ugh", "meh", "bleh",
    "please", "thank you", "thanks", "ty", "np", "yw",
    "what", "why", "how", "when", "where", "who", "which",
    "help", "random", "stuff", "things", "whatever", "etc",
    "and", "the", "or", "but", "so", "then", "just",
    "any", "some", "more", "less", "very", "much",
    "me", "my", "i", "you", "we", "they", "he", "she",
}

# ─── Blocked: Non-health topics ───────────────────────────────────────────────
BLOCKED_TOPICS = [
    # Food
    "recipe", "cooking", "baking", "restaurant", "pizza",
    "pasta", "burger", "sandwich", "salad", "cake",
    "cookie", "dessert", "chocolate", "coffee recipe",
    "smoothie recipe", "juice recipe", "meal prep",
    "diet plan for weight", "nutrition plan",

    # Entertainment
    "movie", "film", "series", "netflix", "music",
    "song lyrics", "artist biography", "album review",
    "youtube", "instagram", "tiktok", "twitter", "facebook",
    "gaming", "video game", "playstation", "xbox", "nintendo",

    # Tech / Programming
    "javascript", "python code", "java code", "c++", "react",
    "nodejs", "angular", "vue", "programming tutorial",
    "coding help", "debug my code", "error in my code",
    "website design", "web app", "mobile app development",
    "api integration", "database query", "sql query",
    "machine learning model", "neural network",
    "git commit", "github", "deployment pipeline",
    "docker", "kubernetes", "aws setup",

    # Finance
    "stock market", "crypto", "bitcoin", "ethereum", "nft",
    "investment strategy", "forex trading", "day trading",
    "loan application", "mortgage rate", "tax filing",
    "financial advice", "money making", "passive income",

    # Travel / Lifestyle
    "travel destination", "vacation plan", "hotel booking",
    "flight ticket", "visa application", "passport renewal",
    "fashion trend", "clothing style", "outfit idea",
    "makeup tutorial", "hair style", "nail art",

    # Sports / News
    "football match", "basketball game", "cricket score",
    "sports news", "player stats", "tournament bracket",
    "politics", "election", "government policy",
    "breaking news", "stock news", "weather forecast",

    # Education / Work
    "homework help", "essay writing", "study guide",
    "exam preparation", "college application", "scholarship",
    "job application", "resume writing", "cover letter",
    "interview tips", "salary negotiation",

    # Random
    "meaning of life", "tell me a joke", "write a poem",
    "generate image", "create story", "translate",
    "math problem", "calculate", "convert currency",
]

# ─── Gibberish Patterns ───────────────────────────────────────────────────────
GIBBERISH_PATTERNS = [
    r'^[a-zA-Z]{1,2}$',
    r'^[0-9\s\.]+$',
    r'^[^a-zA-Z\s]{2,}$',
    r'^(.)\1{3,}$',
    r'^[qwzxkj]{4,}$',
    r'^(?:asdf|qwer|zxcv|hjkl|yuio|bnm)',
    r'(.{1,3})\1{3,}',
    r'^[bcdfghjklmnpqrstvwxyz]{5,}$',
]

KEYBOARD_PATTERNS = [
    "asdf", "qwer", "zxcv", "hjkl", "yuio", "bnm",
    "qwerty", "qwertyuiop", "asdfghjkl", "zxcvbnm",
    "azerty", "abcdef", "zyxwvu", "aabbcc", "xyzxyz",
    "1234", "12345", "123456", "abcd", "abcde",
    "aaaaa", "bbbbb", "ccccc", "xxxxx", "zzzzz",
    "asdfjkl", "lkjhgf", "poiuyt", "mnbvcx",
    "qqqqq", "wwwww", "eeeee", "rrrrr", "ttttt",
]

# ─── Vague inputs that need more detail ───────────────────────────────────────
VAGUE_INPUTS = {
    "pain", "sick", "bad", "not well", "problem",
    "not good", "unwell", "ill", "disease", "condition",
    "issue", "concern", "symptom", "symptoms",
    "something wrong", "not okay", "not ok", "feel bad",
    "feel sick", "feeling bad", "feeling sick",
    "not feeling well", "i feel bad", "i feel sick",
    "discomfort", "unease", "distress",
}

# ─── Known valid remedy-treatable health hints ────────────────────────────────
# If input contains any of these → skip LLM, go straight to pipeline
HEALTH_HINTS = [
    # Head / Neurological
    "headache", "migraine", "head pain", "tension headache",
    "cluster headache", "sinus headache",

    # Sleep
    "insomnia", "sleep", "can't sleep", "cant sleep",
    "trouble sleeping", "sleep disorder", "restless sleep",
    "nightmares", "oversleeping",

    # Digestive
    "acidity", "acid reflux", "heartburn", "bloating",
    "constipation", "diarrhea", "ibs", "indigestion",
    "gas", "flatulence", "stomach ache", "stomach pain",
    "nausea", "vomiting", "ulcer", "gastritis",
    "crohn", "colitis", "celiac", "lactose intolerance",
    "gluten sensitivity",

    # Respiratory (mild)
    "cold", "flu", "cough", "sore throat", "runny nose",
    "congestion", "sinusitis", "allergies", "asthma",
    "sneezing", "nasal", "phlegm", "mucus",

    # Musculoskeletal
    "back pain", "lower back", "knee pain", "joint pain",
    "arthritis", "muscle pain", "stiffness", "cramp",
    "sprain", "strain", "neck pain", "shoulder pain",
    "hip pain", "ankle pain", "wrist pain", "elbow pain",
    "inflammation", "swelling", "fibromyalgia",
    "sciatica", "herniated disc", "posture",

    # Skin
    "acne", "pimple", "eczema", "psoriasis", "rash",
    "itching", "dry skin", "oily skin", "wrinkles",
    "dark circles", "pigmentation", "skin irritation",
    "hives", "dandruff", "scalp", "hair loss", "brittle nails",

    # Energy / Immunity
    "fatigue", "tired", "exhaustion", "weakness", "lethargy",
    "chronic fatigue", "burnout", "low energy",
    "immunity", "immune system", "frequent cold",
    "frequent infection", "low immunity",

    # Stress / Mood (mild)
    "stress", "anxiety", "nervousness", "worry",
    "mood swings", "irritability", "anger management",
    "brain fog", "memory", "focus", "concentration",
    "loneliness", "grief", "low confidence", "insecurity",

    # Hormonal / Metabolic
    "thyroid", "hormones", "hormonal imbalance", "pms",
    "menstrual", "period pain", "irregular period",
    "menopause", "hot flashes", "pcod", "pcos",
    "diabetes management", "blood sugar", "cholesterol",
    "triglycerides", "metabolism", "weight gain",
    "obesity", "overweight",

    # Cardiovascular (mild)
    "high blood pressure", "hypertension", "low blood pressure",
    "hypotension", "poor circulation",

    # Eyes / Ears / Mouth
    "eye strain", "dry eyes", "tinnitus", "ear infection",
    "toothache", "gum", "oral health", "bad breath",
    "mouth ulcer", "dental",

    # Kidney / Liver (mild)
    "kidney stones", "urinary", "uti", "frequent urination",
    "liver health", "detox", "gallstone",

    # General
    "fever", "body ache", "dehydration", "deficiency",
    "vitamin", "mineral", "anemia", "iron deficiency",
    "vertigo", "dizziness", "numbness tingling",
    "bruise", "minor wound", "minor burn",
]

# ─── LLM Validator Prompt ─────────────────────────────────────────────────────
VALIDATOR_SYSTEM = """You are a strict input validator for HerbWise — a natural remedy app.

HerbWise ONLY accepts mild to moderate health conditions that can be helped by herbal remedies, yoga, and acupressure.

Classify the input into exactly one category. Return ONLY the category word.

Categories:

VALID — mild/moderate condition treatable with natural remedies:
Examples: headache, insomnia, back pain, acidity, fatigue, skin rash, bloating, cold, stress, joint pain, hair loss, allergies, constipation, weight management, low immunity

VAGUE — health-related but too generic:
Examples: pain, sick, bad, not well, problem, discomfort, help me, something wrong

SERIOUS — requires emergency medical care, NOT natural remedies:
Examples: chest pain, heart attack, stroke, difficulty breathing, seizure, severe bleeding, loss of consciousness, fracture, overdose, poisoning, anaphylaxis

EMERGENCY — mental health crisis:
Examples: suicidal, want to die, self harm, kill myself, cutting myself

SENSITIVE — serious mental health needing professional care:
Examples: clinical depression, schizophrenia, psychosis, eating disorder, ptsd, bipolar disorder, substance abuse, addiction, hallucinations

INVALID — not a health condition at all:
Examples: software engineer, pizza recipe, hello, asdfgh, javascript, test, football, weather, random words, gibberish, professions, greetings, non-health topics

Return ONLY one word: valid | vague | serious | emergency | sensitive | invalid"""


# ─── Individual Check Functions ───────────────────────────────────────────────

def check_emergency(text: str) -> bool:
    lowered = text.lower()
    return any(kw in lowered for kw in EMERGENCY_KEYWORDS)


def check_serious(text: str) -> tuple[bool, str]:
    lowered = text.lower()
    for symptom in SERIOUS_SYMPTOMS:
        if symptom in lowered:
            return True, symptom
    return False, ""


def check_sensitive(text: str) -> bool:
    lowered = text.lower()
    return any(s in lowered for s in SENSITIVE_BLOCK)


def check_blocked_profession(text: str) -> tuple[bool, str]:
    lowered = text.lower()
    for term in BLOCKED_PROFESSIONS:
        if term in lowered:
            return True, (
                f"'{term}' is a profession, not a health condition. "
                "Please enter a symptom like 'headache', 'fatigue', or 'back pain'."
            )
    return False, ""


def check_blocked_exact(text: str) -> tuple[bool, str]:
    lowered = text.lower().strip()
    if lowered in BLOCKED_EXACT_WORDS:
        return True, (
            "That doesn't appear to be a health condition. "
            "Try something like 'headache', 'insomnia', or 'joint pain'."
        )
    return False, ""


def check_blocked_topic(text: str) -> tuple[bool, str]:
    lowered = text.lower()
    for term in BLOCKED_TOPICS:
        if term in lowered:
            return True, (
                f"HerbWise is for health conditions only. "
                f"'{text}' doesn't appear to be a medical concern. "
                "Please enter a real symptom or health condition."
            )
    return False, ""


def check_gibberish(text: str) -> bool:
    lowered = text.lower().strip()

    for pattern in KEYBOARD_PATTERNS:
        if pattern in lowered:
            return True

    for pattern in GIBBERISH_PATTERNS:
        if re.search(pattern, lowered):
            return True

    letters = [c for c in lowered if c.isalpha()]
    if len(letters) >= 6:
        vowels = sum(1 for c in letters if c in "aeiou")
        if vowels / len(letters) < 0.10:
            return True

    no_spaces = lowered.replace(" ", "")
    if len(no_spaces) >= 6:
        unique = len(set(no_spaces))
        if unique / len(no_spaces) < 0.25:
            return True

    if re.search(r'[bcdfghjklmnpqrstvwxyz]{5,}', lowered):
        return True

    return False


def check_length(text: str) -> tuple[bool, str]:
    stripped = text.strip()

    if len(stripped) == 0:
        return True, "Please enter a health condition or symptom."

    if len(stripped) < 3:
        return True, "Input too short. Please describe your condition in more detail."

    if len(stripped) > 300:
        return True, "Input too long. Please keep your description under 300 characters."

    if stripped.replace(" ", "").isdigit():
        return True, "Please enter a health condition, not numbers."

    if not any(c.isalpha() for c in stripped):
        return True, "Please enter a valid health condition using words."

    if len(set(stripped.replace(" ", ""))) == 1 and len(stripped) > 3:
        return True, "That doesn't look like a health condition. Please be more specific."

    return False, ""


def looks_like_health_input(text: str) -> bool:
    """Fast path — if input contains known health hint, skip LLM."""
    lowered = text.lower()
    return any(
        re.search(rf"\b{re.escape(hint)}\b", lowered)
        for hint in HEALTH_HINTS
    )


def is_vague_input(text: str) -> bool:
    lowered = text.lower().strip()
    return lowered in VAGUE_INPUTS


# ─── Master Validator ─────────────────────────────────────────────────────────

def validate_condition(condition: str) -> dict:
    """
    Full validation. Only returns is_valid=True for mild/moderate
    remedy-treatable conditions. Everything else is blocked.
    """

    # Step 1 — Length / format
    too_short, length_error = check_length(condition)
    if too_short:
        return _invalid(length_error)

    # Step 2 — Emergency (mental health crisis)
    if check_emergency(condition):
        return _emergency(
            "It sounds like you may be in crisis. "
            "Please reach out for immediate help:\n\n"
            "🆘 Emergency Services: 911\n"
            "📞 Crisis Lifeline: 988 (call or text)\n"
            "💬 Crisis Text Line: Text HOME to 741741\n\n"
            "HerbWise is not a substitute for emergency care. "
            "Please contact a professional immediately."
        )

    # Step 3 — Serious medical emergency (needs ER not herbs)
    is_serious, symptom = check_serious(condition)
    if is_serious:
        return _serious(
            f"⚠️ '{condition}' may be a serious medical emergency.\n\n"
            "Please do NOT rely on herbal remedies for this.\n\n"
            "🚑 Call 911 or go to the nearest emergency room immediately.\n"
            "📞 Or call your doctor right now.\n\n"
            "HerbWise only provides general wellness support for mild conditions "
            "and is NOT appropriate for medical emergencies."
        )

    # Step 4 — Sensitive mental health (needs professional, not herbs)
    if check_sensitive(condition):
        return _sensitive(
            f"💙 '{condition}' is a serious mental health condition "
            "that requires professional care.\n\n"
            "HerbWise is not designed for serious mental health conditions. "
            "Please consult a licensed mental health professional or psychiatrist.\n\n"
            "📞 SAMHSA Helpline: 1-800-662-4357 (free, confidential)\n"
            "💬 Crisis Text Line: Text HOME to 741741"
        )

    # Step 5 — Blocked professions
    is_prof, prof_error = check_blocked_profession(condition)
    if is_prof:
        return _invalid(prof_error)

    # Step 6 — Blocked exact words (greetings, gibberish words)
    is_exact, exact_error = check_blocked_exact(condition)
    if is_exact:
        return _invalid(exact_error)

    # Step 7 — Blocked topics (food, tech, finance, etc.)
    is_topic, topic_error = check_blocked_topic(condition)
    if is_topic:
        return _invalid(topic_error)

    # Step 8 — Gibberish detection
    if check_gibberish(condition):
        return _invalid(
            f"'{condition}' doesn't appear to be a health condition. "
            "Please enter a real symptom like 'headache', 'insomnia', or 'lower back pain'."
        )

    # Step 9 — Vague input (local check before LLM)
    if is_vague_input(condition):
        return _vague(condition)

    # Step 10 — Fast path for obvious health inputs (skip LLM)
    if looks_like_health_input(condition):
        return _valid()

    # Step 11 — LLM semantic validation (final authority)
    try:
        llm_result = call_llm(
            primary="groq",
            system=VALIDATOR_SYSTEM,
            user=f"Classify this input: '{condition}'"
        )
        llm_result = llm_result.strip().lower().rstrip(".,! ")

        if llm_result == "valid":
            return _valid()

        if llm_result == "vague":
            return _vague(condition)

        if llm_result == "serious":
            return _serious(
                f"⚠️ '{condition}' may require emergency medical care.\n\n"
                "🚑 Please call 911 or go to the nearest emergency room.\n\n"
                "HerbWise is NOT appropriate for serious medical emergencies."
            )

        if llm_result == "emergency":
            return _emergency(
                "It sounds like you may be in crisis. "
                "Please reach out for immediate help:\n\n"
                "🆘 Emergency Services: 911\n"
                "📞 Crisis Lifeline: 988\n"
                "💬 Crisis Text Line: Text HOME to 741741"
            )

        if llm_result == "sensitive":
            return _sensitive(
                f"💙 '{condition}' requires professional mental health care.\n\n"
                "Please consult a licensed mental health professional.\n\n"
                "📞 SAMHSA Helpline: 1-800-662-4357"
            )

        # invalid or anything unexpected
        return _invalid(
            f"'{condition}' doesn't appear to be a health condition. "
            "Please enter a symptom like 'headache', 'insomnia', "
            "'joint pain', or 'high blood pressure'."
        )

    except Exception:
        # LLM failed — passed all local checks so allow it
        return _valid()


# ─── Result Helpers ───────────────────────────────────────────────────────────

def _valid() -> dict:
    return {
        "is_valid": True,
        "status": "valid",
        "error_message": "",
        "warning_message": "",
        "emergency_message": ""
    }

def _invalid(message: str) -> dict:
    return {
        "is_valid": False,
        "status": "invalid",
        "error_message": message,
        "warning_message": "",
        "emergency_message": ""
    }

def _vague(condition: str) -> dict:
    return {
        "is_valid": False,
        "status": "vague",
        "error_message": (
            f"'{condition}' is too vague. Please be more specific — for example: "
            "'lower back pain', 'trouble falling asleep', or 'digestive bloating'."
        ),
        "warning_message": "",
        "emergency_message": ""
    }

def _serious(message: str) -> dict:
    return {
        "is_valid": False,
        "status": "serious",
        "error_message": "",
        "warning_message": "",
        "emergency_message": message
    }

def _emergency(message: str) -> dict:
    return {
        "is_valid": False,
        "status": "emergency",
        "error_message": "",
        "warning_message": "",
        "emergency_message": message
    }

def _sensitive(message: str) -> dict:
    return {
        "is_valid": False,
        "status": "sensitive",
        "error_message": "",
        "warning_message": "",
        "emergency_message": message
    }