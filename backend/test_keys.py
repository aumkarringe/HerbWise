# test_groq_only.py
import os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()

from utils.llm_routere import call_llm

result = call_llm(
    primary="groq",
    system="You are a helpful assistant. Reply in one sentence.",
    user="What is ginger used for in herbal medicine?"
)
print(f"Result: {result}")