from app.retrieval import bm25_store


class FakeCollection:
    def __init__(self):
        self._documents = [
            {
                "text": "Acute pain management requires careful assessment.",
                "metadata": {
                    "chunk_id": "chunk-1",
                    "page": 12,
                    "organization": "CDC",
                    "document": "guideline_one",
                    "filename": "guideline_one.pdf",
                },
            },
            {
                "text": "Chronic pain can be managed with routine follow-up.",
                "metadata": {
                    "chunk_id": "chunk-2",
                    "page": 4,
                    "organization": "WHO",
                    "document": "guideline_two",
                    "filename": "guideline_two.pdf",
                },
            },
        ]

    def count(self):
        return len(self._documents)

    def get(self, include=None, limit=None):
        docs = self._documents[:limit] if limit is not None else self._documents
        return {
            "documents": [item["text"] for item in docs],
            "metadatas": [item["metadata"] for item in docs],
        }


def test_build_and_search_bm25_index(monkeypatch):
    fake_collection = FakeCollection()
    monkeypatch.setattr(bm25_store, "collection", fake_collection)
    bm25_store.bm25 = None
    bm25_store.documents = []

    built_documents = bm25_store.build_bm25_index()

    assert len(built_documents) == 2
    assert bm25_store.bm25 is not None

    results = bm25_store.search_bm25("acute pain", top_k=2)

    assert len(results) == 2
    assert results[0]["score"] >= results[1]["score"]
    assert all("text" in result and "score" in result for result in results)
    assert {result["title"] for result in results} <= {"Guideline One", "Guideline Two"}
    assert {result["organization"] for result in results} <= {"CDC", "WHO"}
    assert all(result["page"] in {4, 12} for result in results)
