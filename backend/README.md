# MedGuide AI Backend

## Retrieval pipeline

The backend now uses a hybrid retrieval flow for guideline search:

1. Semantic retrieval uses ChromaDB embeddings to find conceptually similar chunks.
2. BM25 retrieval uses keyword matching for exact or near-exact terms.
3. Results are merged, deduplicated by `chunk_id`, reranked, and returned to the API.

### Key modules

- `app/retrieval/retriever.py` - semantic retriever over ChromaDB
- `app/retrieval/bm25_store.py` - BM25 index built from Chroma chunks
- `app/retrieval/hybrid_retriever.py` - orchestrates semantic + BM25 retrieval
- `app/retrieval/reranker.py` - weighted reranker with debug-friendly scores
- `app/api/routes.py` - FastAPI endpoint for retrieval

## API usage

POST `/retrieve`

Example request:

```json
{
  "query": "acute pain",
  "top_k": 5
}
```

The response contains a ranked list of retrieved guideline chunks with metadata such as title, organization, page, and score.
