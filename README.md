# HerbWise🌿
An AI-powered multi-agent pipeline that finds **herbal remedies, yoga poses, and acupressure points** for any health condition — and validates everything against peer-reviewed research before showing it to you.

---

## What It Does

You type a condition like `headache` or `anxiety`. Five AI agents run in sequence:

| Agent | What it does |
|-------|-------------|
| A1 — Remedy Hunter | Finds 5 herbs, 3–5 yoga poses, 3–5 acupressure points |
| A2 — Science Validator | Checks peer-reviewed evidence for every item |
| A3 — Pose & Point Verifier | Safety-checks yoga poses and verifies acupressure anatomy |
| A4 — Citation Checker | Live-checks every source URL |
| A5 — Report Builder | Assembles a clean, plain-English report |

You get a final report with evidence levels (strong / moderate / weak), safety warnings, dosage info, and verified citations — all in one place.

---

## Features (14 total)

| Feature | What you type / do |
|---------|-------------------|
| 🔍 Wellness Search | Any condition — full report |
| 🩺 Symptom Analyzer | Describe symptoms in plain English |
| 🛡️ Safety Check | Add your age, weight, medications |
| 📅 Wellness Plan | 7 / 14 / 30 day daily routine |
| 💊 Dosage Calculator | Personalized doses by age + weight |
| 📖 Preparation Guide | Step-by-step herb prep recipes |
| 🍂 Seasonal Remedies | Auto-detects current season |
| 💄 Natural Beauty | Skin, hair, and beauty concerns |
| 😴 Sleep Optimizer | No input needed — instant sleep protocol |
| 🧘 Stress Relief | No input needed — instant stress protocol |
| 🛡 Immunity Booster | No input needed — instant immunity protocol |
| 🌬️ Breathing Test | Pranayama guide with breath ratios |
| 🏠 Home Remedies+ | Kitchen ingredients only |
| 🏋️ Exercise Planner | Yoga workout by fitness level |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python + FastAPI |
| Frontend | React + Vite |
| LLMs | Groq (Llama 3.3 70B) + Gemini 2.0 Flash |
| Cache | Redis |

---

## Prerequisites

Make sure you have these installed:

- Python 3.10 or higher — [python.org](https://python.org)
- Node.js 18 or higher — [nodejs.org](https://nodejs.org)
- Git — [git-scm.com](https://git-scm.com)

---

## Step 1 — Get Your Free API Keys

You need these before running anything. All are free, no credit card needed.

### Groq (get 1–3 keys)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with your email
3. Go to **API Keys** → **Create API Key**
4. Copy the key — it starts with `gsk_`
5. Optionally repeat with 2 more email addresses for extra quota

### Gemini (get 1–3 keys)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API key**
4. Copy the key — it starts with `AIza`
5. Optionally repeat with 2 more Google accounts for extra quota

### Redis (free cloud instance)
1. Go to [redis.io/try-free](https://redis.io/try-free)
2. Sign up and create a free database
3. From the database dashboard, copy:
   - **Host** (looks like `redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com`)
   - **Port** (usually `12345`)
   - **Password**

---

## Step 2 — Clone and Set Up

```bash
git clone https://github.com/YOUR_USERNAME/remedy-validator.git
cd remedy-validator
```

---

## Step 3 — Backend Setup

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

**Mac / Linux:**
```bash
source .venv/bin/activate
```

**Windows:**
```bash
.venv\Scripts\activate
```

Install dependencies:
```bash
pip install fastapi uvicorn httpx groq google-genai pydantic python-dotenv redis
```

---

## Step 4 — Create Your .env File

Inside the `backend/` folder, create a file called `.env` and paste this in:

```env
# Groq keys (add as many as you have, minimum 1)
GROQ_API_KEY_1=your_first_groq_key_here
GROQ_API_KEY_2=your_second_groq_key_here
GROQ_API_KEY_3=your_third_groq_key_here

# Gemini keys (add as many as you have, minimum 1)
GEMINI_API_KEY_1=your_first_gemini_key_here
GEMINI_API_KEY_2=your_second_gemini_key_here
GEMINI_API_KEY_3=your_third_gemini_key_here

# Redis (from your Redis Cloud dashboard)
REDIS_HOST=your_redis_host_here
REDIS_PORT=your_redis_port_here
REDIS_PASSWORD=your_redis_password_here
```

> **Note:** If you only have 1 Groq key and 1 Gemini key, just fill in `_1` and leave `_2` and `_3` blank or delete those lines. It still works.

---

## Step 5 — Verify Your Keys Work

```bash
cd backend
python test_keys.py
```

Expected output:
```
Groq keys found: 3
  ...XXXXXXXX ✅ WORKING
  ...XXXXXXXX ✅ WORKING
  ...XXXXXXXX ✅ WORKING

Gemini keys found: 3
  ...XXXXXXXX ✅ WORKING
  ...XXXXXXXX ✅ WORKING
  ...XXXXXXXX ✅ WORKING
```

If any key shows ❌ FAILED, double-check you copied it correctly in `.env`.

---

## Step 6 — Start the Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Leave this terminal running.

---

## Step 7 — Frontend Setup

Open a **new terminal window** and run:

```bash
cd remedy-validator/frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

---

## Step 8 — Open the App

Go to [http://localhost:5173](http://localhost:5173) in your browser.

You should see the green sidebar with all 14 features on the left, and Wellness Search as the home page.

---

## Quick Test

1. Click **Wellness Search** in the sidebar
2. Type `headache` in the search bar
3. Click **Analyze →**
4. Watch all 5 agents complete in the pipeline stepper
5. Scroll down to read the full validated report

A complete run takes **30–60 seconds** on first run (free APIs are slower than paid). Subsequent searches for the same condition return instantly from cache.

---

## Rate Limit Tips

The free API tiers have daily limits. If you see an error like `Both Groq and Gemini failed`:

- **Groq** resets at midnight UTC — check usage at [console.groq.com](https://console.groq.com) → Usage
- **Gemini** resets at midnight Pacific time — check at [ai.dev/rate-limit](https://ai.dev/rate-limit)
- The more API keys you add across different accounts, the more quota you have
- Once a condition is cached in Redis, it never hits the API again

---

## Project Structure

```
remedy-validator/
├── backend/
│   ├── main.py                   # FastAPI server + all routes
│   ├── agents/
│   │   ├── a1_remedy_hunter.py
│   │   ├── a2_science_validator.py
│   │   ├── a3_pose_verifier.py
│   │   ├── a4_citation_checker.py
│   │   └── a5_report_builder.py
│   ├── features/
│   │   ├── symptom_analyzer.py
│   │   ├── wellness_plan.py
│   │   ├── dosage_calculator.py
│   │   └── preparation_guide.py
│   ├── utils/
│   │   ├── llm_router.py         # Groq + Gemini with key rotation
│   │   ├── feature_prompts.py    # Prompt variants for all 14 features
│   │   └── cache.py              # Redis caching
│   ├── test_keys.py              # Run this to verify your keys
│   └── .env                      # Your API keys (never commit this)
└── frontend/
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── PipelineStepper.jsx
        │   ├── ReportView.jsx
        │   └── CitationList.jsx
        ├── pages/                # One file per feature (14 total)
        └── hooks/
            └── usePipeline.js
```

---

## API Endpoints

If you want to test the backend directly, go to [http://localhost:8000/docs](http://localhost:8000/docs) after starting the server. You'll see all 15 endpoints with an interactive test UI.

---

## Common Errors

| Error | Fix |
|-------|-----|
| `Both Groq and Gemini failed` | Keys hit daily limit — wait for reset or add more keys |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` or install missing package manually |
| `Connection refused on port 8000` | Backend isn't running — go to `backend/` and run `uvicorn main:app --reload --port 8000` |
| `CORS error in browser` | Make sure backend is running on port 8000, frontend on 5173 |
| `Redis connection failed` | Check REDIS_HOST, REDIS_PORT, REDIS_PASSWORD in `.env` — app still works without Redis, just slower |

---

## Important Notes

- This app is for **informational purposes only** — not a substitute for medical advice
- Always consult a doctor before starting any herbal or alternative treatment
- Evidence levels shown (strong / moderate / weak) are AI-assessed, not clinically certified

---

Built with FastAPI, React, Groq, and Gemini.
