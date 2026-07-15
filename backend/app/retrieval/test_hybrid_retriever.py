from app.retrieval.hybrid_retriever import hybrid_retrieve


def test_hybrid_retrieve_merges_and_deduplicates(monkeypatch):
    monkeypatch.setattr(
        "app.retrieval.hybrid_retriever.retrieve",
        lambda query, top_k: [
            {"chunk_id": "1", "score": 0.89, "text": "semantic one"},
            {"chunk_id": "2", "score": 0.82, "text": "semantic two"},
        ],
    )
    monkeypatch.setattr(
        "app.retrieval.hybrid_retriever.search_bm25",
        lambda query, top_k: [
            {"chunk_id": "2", "score": 15.3, "text": "bm25 two"},
            {"chunk_id": "3", "score": 11.9, "text": "bm25 three"},
        ],
    )

    results = hybrid_retrieve("acute pain", top_k=3)

    assert [item["chunk_id"] for item in results] == ["1", "2", "3"]
    assert len(results) == 3
    assert results[0]["chunk_id"] == "1"
    assert results[0]["semantic_score"] == 0.0
    assert results[0]["bm25_score"] == 0.0
