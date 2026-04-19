# agents/a4_citation_checker.py
import json
import re
import httpx
from utils.llm_routere import call_llm
from utils.feature_prompts import get_feature_prompt

SYSTEM = """You are a academic citation verifier specializing in medical and traditional medicine research.

Your job is to generate real, verifiable citations for herbs, yoga poses, and acupressure points,
then structure them so they can be URL-checked.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation.
- Only use citations from these trusted sources:
  * PubMed (https://pubmed.ncbi.nlm.nih.gov/{PMID}/)
  * Cochrane Library (https://www.cochranelibrary.com)
  * WHO (https://www.who.int)
  * NIH (https://www.nih.gov)
  * Google Scholar (https://scholar.google.com)
- Use real PMIDs you are confident exist. If unsure, use WHO or NIH base URLs.
- Never invent author names or paper titles.

Return this exact schema:
{
  "citations": [
    {
      "item_name": "string",
      "item_type": "herb|yoga|acupressure",
      "paper_title": "string",
      "authors": "string",
      "year": "string",
      "source": "PubMed|Cochrane|WHO|NIH|GoogleScholar",
      "url": "string",
      "doi": "string or null"
    }
  ]
}
"""

def clean_json_response(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"```$", "", text)
    return text.strip()

def verify_url(url: str) -> tuple[bool, str]:
    """
    Check if a URL is reachable.
    Returns (is_live, status)
    """
    try:
        response = httpx.get(
            url,
            timeout=8.0,
            follow_redirects=True,
            headers={"User-Agent": "Mozilla/5.0"}
        )
        if response.status_code == 200:
            return True, "verified"
        elif response.status_code == 403:
            # Paywalled but exists
            return True, "partially_verified"
        elif response.status_code == 404:
            return False, "not_found"
        else:
            return False, f"http_{response.status_code}"

    except httpx.TimeoutException:
        return False, "timeout"
    except Exception as e:
        return False, f"error: {str(e)[:50]}"

def run(a3_output: dict, feature_key: str = "wellness_search") -> dict:
    condition = a3_output["condition"]
    print(f"[A4] Generating and verifying citations for: {condition}")

    # Build item list for LLM
    herbs = a3_output.get("validated_herbs", [])
    poses = a3_output.get("verified_poses", [])
    points = a3_output.get("verified_acupressure_points", [])

    herbs_list = "\n".join(
        [f"- {h['name']} (herb) — evidence: {h['evidence_level']}"
         for h in herbs if h.get("safe_to_recommend")]
    )
    poses_list = "\n".join(
        [f"- {p['name']} (yoga) — safe: {p['is_safe']}"
         for p in poses if p.get("is_safe")]
    )
    points_list = "\n".join(
        [f"- {a['point_name']} (acupressure) — accurate: {a['anatomy_accurate']}"
         for a in points if a.get("anatomy_accurate")]
    )

    user_prompt = f"""Generate one real, verifiable citation for each of these items used for {condition}:

HERBS:
{herbs_list}

YOGA POSES:
{poses_list}

ACUPRESSURE POINTS:
{points_list}

For each item provide one citation from PubMed, WHO, NIH, or Cochrane.
Only use PMIDs you are highly confident are real.
If unsure of a specific paper, use the base URL of WHO or NIH instead.
"""

    raw = call_llm(primary="gemini", system=SYSTEM, user=user_prompt)
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"[A4] JSON parse failed: {e}")
        print(f"[A4] Raw response: {raw[:500]}")
        raise ValueError(f"A4 returned invalid JSON: {e}")

    if "citations" not in result:
        raise ValueError("[A4] Missing 'citations' key in output")

    # Now verify every URL live
    print(f"[A4] Checking {len(result['citations'])} citation URLs...")

    verified_citations = []
    removed_citations = []

    for cite in result["citations"]:
        url = cite.get("url", "")
        if not url:
            cite["verification_status"] = "no_url"
            removed_citations.append(cite)
            continue

        is_live, status = verify_url(url)
        cite["verification_status"] = status

        if is_live:
            verified_citations.append(cite)
            print(f"  ✓ {cite['item_name']} — {status} ({url})")
        else:
            removed_citations.append(cite)
            print(f"  ✗ {cite['item_name']} — {status} ({url}) → REMOVED")

    print(f"[A4] {len(verified_citations)} verified, {len(removed_citations)} removed")

    # Pass everything forward to A5
    return {
        "condition": condition,
        "feature_key": feature_key,          # ← add this line
        "verified_citations": verified_citations,
        "removed_citations": removed_citations,
        "validated_herbs": a3_output.get("validated_herbs", []),
        "verified_poses": a3_output.get("verified_poses", []),
        "verified_acupressure_points": a3_output.get("verified_acupressure_points", []),
        "original": a3_output.get("original", {}),
        "overall_safety_notes": a3_output.get("overall_safety_notes", "")
    }