from app.ingest.embedder import embed_text
from app.retrieval.search import similarity_search


def retrieve(query: str, top_k: int = 5):
    query_embedding = embed_text(query)
    results = similarity_search(query_embedding=query_embedding, top_k=top_k)

    retrieved_chunks = []

    for i in range(len(results["documents"][0])):
        metadata = dict(results["metadatas"][0][i])

        if "title" not in metadata:
            if "filename" in metadata:
                metadata["title"] = metadata["filename"].rsplit(".", 1)[0].replace("_", " ").title()
            elif "document" in metadata:
                metadata["title"] = str(metadata["document"]).replace("_", " ").title()
            else:
                metadata["title"] = "Untitled document"

        if "title" in metadata and isinstance(metadata["title"], str):
            metadata["title"] = metadata["title"].replace("Cdc", "CDC")

        metadata.pop("filename", None)

        chunk = {
            "text": results["documents"][0][i],
            "score": 1 - results["distances"][0][i],  # similarity approximation
        }
        chunk.update(metadata)
        retrieved_chunks.append(chunk)

    retrieved_chunks.sort(key=lambda x: x["score"], reverse=True)

    return retrieved_chunks