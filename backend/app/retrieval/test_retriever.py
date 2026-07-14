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

    assert results == [
        {
            "text": "second chunk",
            "page": 16,
            "organization": "CDC",
            "document": "cdc_opioid_guideline",
            "filename": "cdc_opioid_guideline.pdf",
            "chunk_id": "chunk-2",
            "title": "Cdc Opioid Guideline",
            "score": 0.8,
        },
        {
            "text": "first chunk",
            "page": 14,
            "organization": "CDC",
            "document": "cdc_opioid_guideline",
            "filename": "cdc_opioid_guideline.pdf",
            "chunk_id": "chunk-1",
            "title": "Cdc Opioid Guideline",
            "score": 0.3,
        },
    ]


def main():
    query = sys.argv[1] if len(sys.argv) > 1 else "acute pain"

    results = retrieve(query)

    pprint(results)


if __name__ == "__main__":
    main()