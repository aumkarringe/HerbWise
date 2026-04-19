# utils/llm_router.py — full replacement

import os
import time
import random
from groq import Groq
from groq import RateLimitError as GroqRateLimitError
from google import genai
from google.genai.errors import ClientError

GROQ_MODEL = "llama-3.3-70b-versatile"
GEMINI_MODEL = "gemini-2.0-flash"

def get_groq_keys():
    return [k for k in [
        os.getenv("GROQ_API_KEY_1"),
        os.getenv("GROQ_API_KEY_2"),
        os.getenv("GROQ_API_KEY_3"),
    ] if k]

def get_gemini_keys():
    return [k for k in [
        os.getenv("GEMINI_API_KEY_1"),
        os.getenv("GEMINI_API_KEY_2"),
        os.getenv("GEMINI_API_KEY_3"),
    ] if k]

def call_groq(system: str, user: str) -> str:
    keys = get_groq_keys()
    if not keys:
        raise Exception("No Groq keys found")

    random.shuffle(keys)

    for key in keys:
        try:
            client = Groq(api_key=key)
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user}
                ]
            )
            return response.choices[0].message.content

        except GroqRateLimitError:
            print(f"[groq] Key ...{key[-6:]} rate limited, trying next...")
            time.sleep(2)
            continue

        except Exception as e:
            print(f"[groq] Key ...{key[-6:]} error: {e}")
            continue

    raise Exception("GROQ_ALL_EXHAUSTED")

def call_gemini(system: str, user: str) -> str:
    keys = get_gemini_keys()
    if not keys:
        raise Exception("No Gemini keys found")

    random.shuffle(keys)

    for key in keys:
        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=f"{system}\n\n{user}"
            )
            return response.text

        except ClientError as e:
            # Catch 429 explicitly
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e) or "quota" in str(e).lower():
                print(f"[gemini] Key ...{key[-6:]} exhausted, trying next...")
                continue
            raise

        except Exception as e:
            print(f"[gemini] Key ...{key[-6:]} error: {e}")
            continue

    raise Exception("GEMINI_ALL_EXHAUSTED")

def call_llm(primary: str, system: str, user: str) -> str:
    """
    Tries primary provider first, falls back to the other.
    Both providers rotate across all available keys internally.
    """
    providers = ["groq", "gemini"] if primary == "groq" else ["gemini", "groq"]
    callers   = {"groq": call_groq, "gemini": call_gemini}

    last_error = None

    for provider in providers:
        try:
            print(f"[llm] Trying {provider}...")
            result = callers[provider](system, user)
            print(f"[llm] Success via {provider}")
            return result

        except Exception as e:
            print(f"[llm] {provider} failed: {e}")
            last_error = e
            continue  # try next provider

    raise Exception(f"All providers failed. Last error: {last_error}")