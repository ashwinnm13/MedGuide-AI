"""
Regression test: 15 diverse queries across local guideline and web-search paths.
Run with: uv run python tests/regression_test.py
Requires the FastAPI server to be running on localhost:8000.
"""
import json
import sys
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

QUERIES = [
    # Local guideline queries
    "acute pain",
    "opioid tapering",
    "recommendation 11",
    "pregnant women covid-19",
    "chronic pain definition",
    "nonopioid therapies",
    "opioid dosage guidelines",
    "naloxone prescribing",
    "benzodiazepine and opioid",
    "urine drug testing",
    # Web-search queries (should route to web)
    "latest WHO guidelines on monkeypox 2025",
    "new diabetes treatment breakthroughs",
    "what is the current CDC guidance on RSV vaccines",
    "bird flu H5N1 latest updates",
    "FDA approved weight loss drugs 2025",
]


def run_regression():
    passed = 0
    failed = 0
    results = []

    for i, query in enumerate(QUERIES, 1):
        print(f"\n{'='*60}")
        print(f"[{i}/{len(QUERIES)}] Query: {query}")
        print(f"{'='*60}")

        try:
            resp = requests.post(
                f"{BASE_URL}/chat",
                json={"query": query, "top_k": 5},
                timeout=120,
            )
            resp.raise_for_status()
            data = resp.json()

            answer = data.get("answer", "")
            sources = data.get("sources", [])
            verification = data.get("verification", {})

            # Checks
            checks = {
                "has_answer": bool(answer and len(answer) > 10),
                "no_sources_in_answer": "Sources:" not in answer,
                "no_leaked_refs": "(48)" not in answer and "[50]" not in answer,
                "has_sources": len(sources) > 0,
                "no_duplicate_sources": len(sources) == len(
                    {(s.get("title"), s.get("page"), s.get("url")) for s in sources}
                ),
                "has_verification": verification.get("supported") is not None,
                "no_spacing_artifacts": " ." not in answer and " ," not in answer,
            }

            all_ok = all(checks.values())
            status = "[PASS]" if all_ok else "[FAIL]"

            if all_ok:
                passed += 1
            else:
                failed += 1

            print(f"Status: {status}")
            print(f"Answer: {answer[:150]}...")
            print(f"Sources: {len(sources)}")
            print(f"Verified: {verification.get('supported')}")

            for check_name, check_val in checks.items():
                if not check_val:
                    print(f"  FAILED CHECK: {check_name}")

            results.append({
                "query": query,
                "status": "PASS" if all_ok else "FAIL",
                "checks": checks,
                "answer_preview": answer[:200],
                "source_count": len(sources),
                "verified": verification.get("supported"),
            })

        except Exception as e:
            failed += 1
            print(f"Status: [ERROR] - {e}")
            results.append({
                "query": query,
                "status": "ERROR",
                "error": str(e),
            })

    print(f"\n{'='*60}")
    print(f"REGRESSION RESULTS: {passed} passed, {failed} failed out of {len(QUERIES)}")
    print(f"{'='*60}")

    with open("tests/regression_results.json", "w") as f:
        json.dump(results, f, indent=2)
    print("Results saved to tests/regression_results.json")


if __name__ == "__main__":
    run_regression()

