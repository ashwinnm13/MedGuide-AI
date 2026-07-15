from app.retrieval.reranker import rerank


def test_rerank_computes_weighted_final_scores():
    results = [
        {"chunk_id": "1", "score": 0.89, "retriever": "semantic"},
        {"chunk_id": "2", "score": 15.3, "retriever": "bm25"},
    ]

    reranked = rerank(results, top_k=2)

    assert len(reranked) == 2
    assert reranked[0]["chunk_id"] == "1"
    assert reranked[0]["final_score"] >= reranked[1]["final_score"]
    assert "semantic_score" in reranked[0]
    assert "bm25_score" in reranked[0]
