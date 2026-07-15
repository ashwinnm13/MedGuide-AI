from pprint import pprint

from app.retrieval.hybrid_retriever import hybrid_retrieve

queries = [
    "acute pain",
    "chronic pain",
    "opioid prescribing",
    "maximize benefits and minimize risks",
]

for query in queries:
    print(f"\n{'=' * 60}")
    print(f"Query: {query}")
    print("=" * 60)

    results = hybrid_retrieve(query, top_k=5)

    pprint(results)