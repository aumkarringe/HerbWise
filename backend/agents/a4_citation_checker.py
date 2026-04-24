# agents/a4_citation_checker.py
import json
import re
import time
import httpx
from utils.llm_routere import call_llm

# ─── Real API Search Functions ────────────────────────────────────────────────

def search_pubmed(query: str, max_results: int = 3) -> list[dict]:
    try:
        search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        search_params = {
            "db": "pubmed",
            "term": query,
            "retmax": max_results,
            "retmode": "json",
            "sort": "relevance"
        }
        search_resp = httpx.get(search_url, params=search_params, timeout=10)
        search_data = search_resp.json()
        pmids = search_data.get("esearchresult", {}).get("idlist", [])

        if not pmids:
            return []

        fetch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
        fetch_params = {"db": "pubmed", "id": ",".join(pmids), "retmode": "json"}
        fetch_resp = httpx.get(fetch_url, params=fetch_params, timeout=10)
        fetch_data = fetch_resp.json()
        results    = fetch_data.get("result", {})

        papers = []
        for pmid in pmids:
            paper = results.get(pmid, {})
            if not paper or paper.get("error"):
                continue
            authors = paper.get("authors", [])
            author_str = ", ".join([a.get("name", "") for a in authors[:3]])
            if len(authors) > 3:
                author_str += " et al."
            papers.append({
                "title":   paper.get("title", "").rstrip("."),
                "authors": author_str,
                "year":    paper.get("pubdate", "")[:4],
                "pmid":    pmid,
                "url":     f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                "source":  "PubMed",
                "journal": paper.get("source", ""),
                "verified": True
            })

        time.sleep(0.4)
        return papers

    except Exception as e:
        print(f"[PubMed] Search failed for '{query}': {e}")
        return []


def search_semantic_scholar(query: str, max_results: int = 2) -> list[dict]:
    try:
        url = "https://api.semanticscholar.org/graph/v1/paper/search"
        params = {
            "query": query,
            "limit": max_results,
            "fields": "title,authors,year,externalIds,openAccessPdf,journal"
        }
        resp = httpx.get(url, params=params, timeout=10,
                         headers={"User-Agent": "RemedyValidator/1.0"})
        data = resp.json()

        papers = []
        for paper in data.get("data", []):
            if not paper.get("title"):
                continue
            ext_ids  = paper.get("externalIds", {})
            doi      = ext_ids.get("DOI")
            paper_id = paper.get("paperId", "")
            if doi:
                url_str = f"https://doi.org/{doi}"
            elif paper_id:
                url_str = f"https://www.semanticscholar.org/paper/{paper_id}"
            else:
                continue
            authors = paper.get("authors", [])
            author_str = ", ".join([a.get("name", "") for a in authors[:3]])
            if len(authors) > 3:
                author_str += " et al."
            papers.append({
                "title":   paper.get("title", ""),
                "authors": author_str,
                "year":    str(paper.get("year", "")),
                "url":     url_str,
                "doi":     doi,
                "source":  "Semantic Scholar",
                "journal": paper.get("journal", {}).get("name", "") if paper.get("journal") else "",
                "verified": True
            })
        return papers

    except Exception as e:
        print(f"[Semantic Scholar] Search failed for '{query}': {e}")
        return []


def search_openalex(query: str, max_results: int = 2) -> list[dict]:
    try:
        url = "https://api.openalex.org/works"
        params = {
            "search": query,
            "per-page": max_results,
            "filter": "type:journal-article",
            "sort": "relevance_score:desc",
            "select": "title,authorships,publication_year,doi,primary_location"
        }
        resp = httpx.get(url, params=params, timeout=10,
                         headers={"User-Agent": "RemedyValidator/1.0"})
        data = resp.json()

        papers = []
        for work in data.get("results", []):
            if not work.get("title"):
                continue
            doi = work.get("doi", "")
            if doi:
                doi = doi.replace("https://doi.org/", "")
                url_str = f"https://doi.org/{doi}"
            else:
                continue
            authors = work.get("authorships", [])
            author_names = [a.get("author", {}).get("display_name", "")
                            for a in authors[:3]]
            author_str = ", ".join([n for n in author_names if n])
            if len(authors) > 3:
                author_str += " et al."
            journal = ""
            loc = work.get("primary_location", {})
            if loc and loc.get("source"):
                journal = loc["source"].get("display_name", "")
            papers.append({
                "title":   work.get("title", ""),
                "authors": author_str,
                "year":    str(work.get("publication_year", "")),
                "url":     url_str,
                "doi":     doi,
                "source":  "OpenAlex",
                "journal": journal,
                "verified": True
            })
        return papers

    except Exception as e:
        print(f"[OpenAlex] Search failed for '{query}': {e}")
        return []


# ─── Search Term Generator ────────────────────────────────────────────────────

TERM_SYSTEM = """You are a medical research librarian.

Generate precise PubMed search terms for each item provided.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no backticks.
- Keep queries short and specific (3-6 words max)
- Focus on clinical/human studies

Return this schema:
{
  "search_terms": [
    {
      "item_name": "string",
      "item_type": "herb|yoga|acupressure|breathing|exercise",
      "query": "string"
    }
  ]
}
"""

def _extract_items(a3_output: dict) -> list[dict]:
    """Extract searchable items from A3 output regardless of group."""
    group = a3_output.get("group", "full")
    condition = a3_output["condition"]
    items = []

    if group == "full":
        for h in a3_output.get("validated_herbs", []):
            if h.get("safe_to_recommend"):
                items.append({"name": h["name"], "type": "herb"})
        for p in a3_output.get("verified_poses", []):
            if p.get("is_safe"):
                items.append({"name": p["name"], "type": "yoga"})
        for a in a3_output.get("verified_acupressure_points", []):
            if a.get("anatomy_accurate"):
                items.append({"name": a["point_name"], "type": "acupressure"})

    elif group == "herbs_only":
        for h in a3_output.get("validated_herbs", []):
            if h.get("safe_to_recommend"):
                items.append({"name": h["name"], "type": "herb"})

    elif group == "breathing":
        for t in a3_output.get("validated_techniques", []):
            if t.get("safe_to_recommend"):
                items.append({"name": t["name"], "type": "breathing"})
        for h in a3_output.get("validated_lung_herbs", []):
            if h.get("safe_to_recommend"):
                items.append({"name": h["name"], "type": "herb"})

    elif group == "exercise":
        for p in a3_output.get("verified_main_sequence", []):
            if p.get("is_safe"):
                items.append({"name": p["name"], "type": "exercise"})
        for h in a3_output.get("validated_recovery_herbs", []):
            if h.get("safe_to_recommend"):
                items.append({"name": h["name"], "type": "herb"})

    return items


def generate_search_terms(a3_output: dict) -> list[dict]:
    condition = a3_output["condition"]
    items     = _extract_items(a3_output)

    if not items:
        return []

    items_text = "\n".join([f"- {i['name']} ({i['type']})" for i in items])

    user_prompt = f"""Generate precise PubMed search terms for these items used for {condition}:

{items_text}

For each item create a short, specific search query (3-6 words) that would find
clinical studies about its effectiveness for {condition}."""

    raw = call_llm(primary="groq", system=TERM_SYSTEM, user=user_prompt)
    raw = raw.strip()
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
    raw = re.sub(r"```$", "", raw)

    try:
        result = json.loads(raw)
        return result.get("search_terms", [])
    except Exception as e:
        print(f"[A4] Search term generation failed: {e}")
        return []


# ─── URL Verifier ─────────────────────────────────────────────────────────────

def verify_url(url: str) -> tuple[bool, str]:
    try:
        resp = httpx.get(url, timeout=8.0, follow_redirects=True,
                         headers={"User-Agent": "Mozilla/5.0"})
        if resp.status_code == 200: return True, "verified"
        if resp.status_code == 403: return True, "partially_verified"
        if resp.status_code == 404: return False, "not_found"
        return False, f"http_{resp.status_code}"
    except httpx.TimeoutException:
        return False, "timeout"
    except Exception as e:
        return False, f"error: {str(e)[:40]}"


# ─── Main Run ─────────────────────────────────────────────────────────────────

def run(a3_output: dict, feature_key: str = "wellness_search") -> dict:
    condition = a3_output["condition"]
    group     = a3_output.get("group", "full")
    print(f"[A4] Finding real citations for: {condition} | Group: {group}")

    print("[A4] Generating search terms...")
    search_terms = generate_search_terms(a3_output)

    if not search_terms:
        print("[A4] No search terms generated — skipping citations")
        return _empty_output(a3_output, feature_key)

    verified_citations   = []
    unverified_citations = []

    print(f"[A4] Searching {len(search_terms)} items...")

    for term in search_terms:
        item_name = term["item_name"]
        item_type = term["item_type"]
        query     = term["query"]
        found     = False

        print(f"  Searching: {item_name} — '{query}'")

        pubmed_results = search_pubmed(query, max_results=2)
        if pubmed_results:
            best = pubmed_results[0]
            best["item_name"] = item_name
            best["item_type"] = item_type
            best["verification_status"] = "verified"
            verified_citations.append(best)
            print(f"  ✓ PubMed: {best['title'][:60]}...")
            found = True

        if not found:
            ss_results = search_semantic_scholar(query, max_results=2)
            if ss_results:
                best = ss_results[0]
                best["item_name"] = item_name
                best["item_type"] = item_type
                best["verification_status"] = "verified"
                verified_citations.append(best)
                print(f"  ✓ Semantic Scholar: {best['title'][:60]}...")
                found = True

        if not found:
            oa_results = search_openalex(query, max_results=2)
            if oa_results:
                best = oa_results[0]
                best["item_name"] = item_name
                best["item_type"] = item_type
                best["verification_status"] = "verified"
                verified_citations.append(best)
                print(f"  ✓ OpenAlex: {best['title'][:60]}...")
                found = True

        if not found:
            print(f"  ✗ No results found for: {item_name}")
            unverified_citations.append({
                "item_name": item_name,
                "item_type": item_type,
                "query": query,
                "verification_status": "not_found"
            })

    print(f"[A4] Done — {len(verified_citations)} verified, "
          f"{len(unverified_citations)} not found")

    # Pass through all data from A3 regardless of group
    return {
        "condition":            condition,
        "feature_key":          feature_key,
        "group":                group,
        "verified_citations":   verified_citations,
        "removed_citations":    unverified_citations,
        "overall_safety_notes": a3_output.get("overall_safety_notes", ""),
        "sequence_safety_notes": a3_output.get("sequence_safety_notes", ""),
        "original":             a3_output.get("original", {}),

        # Full group
        "validated_herbs":               a3_output.get("validated_herbs", []),
        "verified_poses":                a3_output.get("verified_poses", []),
        "verified_acupressure_points":   a3_output.get("verified_acupressure_points", []),

        # Breathing group
        "validated_techniques":          a3_output.get("validated_techniques", []),
        "validated_lung_herbs":          a3_output.get("validated_lung_herbs", []),

        # Exercise group
        "verified_warmup":               a3_output.get("verified_warmup", []),
        "verified_main_sequence":        a3_output.get("verified_main_sequence", []),
        "verified_cooldown":             a3_output.get("verified_cooldown", []),
        "validated_recovery_herbs":      a3_output.get("validated_recovery_herbs", []),
    }


def _empty_output(a3_output: dict, feature_key: str) -> dict:
    return {
        "condition":            a3_output["condition"],
        "feature_key":          feature_key,
        "group":                a3_output.get("group", "full"),
        "verified_citations":   [],
        "removed_citations":    [],
        "overall_safety_notes": a3_output.get("overall_safety_notes", ""),
        "sequence_safety_notes": a3_output.get("sequence_safety_notes", ""),
        "original":             a3_output.get("original", {}),
        "validated_herbs":               a3_output.get("validated_herbs", []),
        "verified_poses":                a3_output.get("verified_poses", []),
        "verified_acupressure_points":   a3_output.get("verified_acupressure_points", []),
        "validated_techniques":          a3_output.get("validated_techniques", []),
        "validated_lung_herbs":          a3_output.get("validated_lung_herbs", []),
        "verified_warmup":               a3_output.get("verified_warmup", []),
        "verified_main_sequence":        a3_output.get("verified_main_sequence", []),
        "verified_cooldown":             a3_output.get("verified_cooldown", []),
        "validated_recovery_herbs":      a3_output.get("validated_recovery_herbs", []),
    }