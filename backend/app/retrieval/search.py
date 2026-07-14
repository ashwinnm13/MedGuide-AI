from app.ingest.chroma_store import collection


def similarity_search(query_embedding, top_k: int = 5):
    """
    Perform semantic similarity search in ChromaDB.
    """

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    return results