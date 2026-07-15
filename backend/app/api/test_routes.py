from app.api.routes import retrieve_documents
from app.schemas.retrieval import RetrieveRequest


def test_retrieve_documents_uses_hybrid_retriever(monkeypatch):
    captured = {}

    def fake_hybrid(query, top_k):
        captured["query"] = query
        captured["top_k"] = top_k
        return [
            {
                "text": "hybrid chunk",
                "semantic_score": 0.95,
                "bm25_score": 0.0,
                "final_score": 0.95,
                "chunk_id": "chunk-1",
                "title": "Sample title",
                "organization": "CDC",
                "page": 1,
            }
        ]

    monkeypatch.setattr("app.api.routes.hybrid_retrieve", fake_hybrid)

    response = retrieve_documents(RetrieveRequest(query="acute pain", top_k=3))

    assert response["results"] == [
        {
            "text": "hybrid chunk",
            "semantic_score": 0.95,
            "bm25_score": 0.0,
            "final_score": 0.95,
            "chunk_id": "chunk-1",
            "title": "Sample title",
            "organization": "CDC",
            "page": 1,
        }
    ]
    assert captured == {"query": "acute pain", "top_k": 3}
