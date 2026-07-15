import sys
from pprint import pprint

from app.retrieval.retriever import retrieve


def test_retrieve_flattens_metadata_and_sorts_by_score(monkeypatch):
    monkeypatch.setattr("app.retrieval.retriever.embed_text", lambda query: [0.1, 0.2])
    monkeypatch.setattr(
        "app.retrieval.retriever.similarity_search",
        lambda query_embedding, top_k: {
            "documents": [["first chunk", "second chunk"]],
            "metadatas": [[
                {
                    "page": 14,
                    "organization": "CDC",
                    "document": "cdc_opioid_guideline",
                    "filename": "cdc_opioid_guideline.pdf",
                    "chunk_id": "chunk-1",
                },
                {
                    "page": 16,
                    "organization": "CDC",
                    "document": "cdc_opioid_guideline",
                    "filename": "cdc_opioid_guideline.pdf",
                    "chunk_id": "chunk-2",
                },
            ]],
            "distances": [[0.7, 0.2]],
        },
    )

    results = retrieve("acute pain", top_k=2)

    assert results[0]["text"] == "second chunk"
    assert results[0]["page"] == 16
    assert results[0]["organization"] == "CDC"
    assert results[0]["document"] == "cdc_opioid_guideline"
    assert results[0]["filename"] == "cdc_opioid_guideline.pdf"
    assert results[0]["chunk_id"] == "chunk-2"
    assert results[0]["title"] == "2022 CDC Clinical Practice Guideline for Prescribing Opioids for Pain"
    assert results[0]["semantic_score"] == 0.8
    assert results[0]["bm25_score"] == 0.0
    assert results[0]["final_score"] == 0.8

    assert results[1]["text"] == "first chunk"
    assert results[1]["semantic_score"] == 0.3
    assert results[1]["bm25_score"] == 0.0
    assert results[1]["final_score"] == 0.3


def main():
    query = sys.argv[1] if len(sys.argv) > 1 else "acute pain"

    results = retrieve(query)

    pprint(results)


if __name__ == "__main__":
    main()