from app.retrieval.bm25_store import search_bm25
from app.retrieval.reranker import rerank
from app.retrieval.retriever import retrieve


def hybrid_retrieve(query: str, top_k: int = 5):
    """
    Combine semantic and BM25 results into a single ranked list by merging
    entries with the same chunk_id and keeping both raw scores.
    """
    semantic_results = retrieve(query=query, top_k=top_k)
    bm25_results = search_bm25(query=query, top_k=top_k)

    merged_results = {}

    for result in semantic_results:
        chunk_id = result.get("chunk_id")
        if not chunk_id:
            continue

        merged_result = dict(result)
        merged_result["semantic_score"] = float(result.get("final_score", result.get("semantic_score", 0.0)))
        merged_result["bm25_score"] = 0.0
        merged_results[chunk_id] = merged_result

    for result in bm25_results:
        chunk_id = result.get("chunk_id")
        if not chunk_id:
            continue

        if chunk_id in merged_results:
            merged_results[chunk_id]["bm25_score"] = float(result.get("final_score", result.get("bm25_score", 0.0)))
        else:
            merged_result = dict(result)
            merged_result["semantic_score"] = 0.0
            merged_result["bm25_score"] = float(result.get("final_score", result.get("bm25_score", 0.0)))
            merged_results[chunk_id] = merged_result

    return rerank(list(merged_results.values()))[:top_k]
