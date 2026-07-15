def normalize_scores(results):
    """
    Normalize semantic and BM25 scores independently so they become comparable
    before combining them.
    """
    normalized_results = []

    semantic_scores = [
        float(result.get("semantic_score", 0.0))
        for result in results
    ]
    bm25_scores = [
        float(result.get("bm25_score", 0.0))
        for result in results
    ]

    semantic_max = max(semantic_scores) if semantic_scores else 1.0
    semantic_min = min(semantic_scores) if semantic_scores else 0.0
    bm25_max = max(bm25_scores) if bm25_scores else 1.0
    bm25_min = min(bm25_scores) if bm25_scores else 0.0

    for result in results:
        normalized_result = dict(result)
        semantic_score = float(normalized_result.get("semantic_score", 0.0))
        bm25_score = float(normalized_result.get("bm25_score", 0.0))

        if semantic_max > semantic_min:
            semantic_norm = (semantic_score - semantic_min) / (semantic_max - semantic_min)
        else:
            semantic_norm = 1.0 if semantic_score > 0.0 else 0.0

        if bm25_max > bm25_min:
            bm25_norm = (bm25_score - bm25_min) / (bm25_max - bm25_min)
        else:
            bm25_norm = 1.0 if bm25_score > 0.0 else 0.0

        normalized_result["semantic_score"] = semantic_norm
        normalized_result["bm25_score"] = bm25_norm
        normalized_results.append(normalized_result)

    return normalized_results


def compute_final_scores(results):
    """
    Combine normalized semantic and BM25 scores using a simple weighted sum.
    """
    for item in results:
        item["final_score"] = (
            item.get("semantic_score", 0.0) * 0.7
            + item.get("bm25_score", 0.0) * 0.3
        )

    return results


def rerank(results, top_k=5):
    """
    Rerank merged retrieval results using normalized weighted scores.
    """
    normalized_results = normalize_scores(results)
    scored_results = compute_final_scores(normalized_results)
    scored_results.sort(key=lambda item: item.get("final_score", 0.0), reverse=True)
    return scored_results[:top_k]
