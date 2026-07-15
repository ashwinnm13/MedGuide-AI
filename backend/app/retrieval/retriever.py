from app.ingest.embedder import embed_text
from app.retrieval.metadata_registry import get_document_metadata
from app.retrieval.search import similarity_search


def similarity_score(distance: float) -> float:
    return round(1 - distance, 4)


def retrieve(query: str, top_k: int = 5):
    query_embedding = embed_text(query)
    results = similarity_search(query_embedding=query_embedding, top_k=top_k)

    retrieved_chunks = []

    for i in range(len(results["documents"][0])):
        metadata = dict(results["metadatas"][0][i])

        if "document" in metadata:
            registry_metadata = get_document_metadata(metadata.get("document"))
            metadata.update(registry_metadata)

        if "title" not in metadata:
            if "filename" in metadata:
                metadata["title"] = metadata["filename"].rsplit(".", 1)[0].replace("_", " ").title()
            elif "document" in metadata:
                metadata["title"] = str(metadata["document"]).replace("_", " ").title()
            else:
                metadata["title"] = "Untitled document"

        if "title" in metadata and isinstance(metadata["title"], str):
            title = metadata["title"]
            if title.lower().startswith("2022 cdc"):
                metadata["title"] = title
            else:
                metadata["title"] = title.replace("_", " ")
                metadata["title"] = metadata["title"].replace("Cdc", "CDC")
                metadata["title"] = metadata["title"].replace("cdc", "CDC")

        distance = results["distances"][0][i]
        score = similarity_score(distance)
        print(f"Distance: {distance:.4f} -> Score: {score:.4f}")

        chunk = {
            "text": results["documents"][0][i],
            "semantic_score": score,
            "bm25_score": 0.0,
            "final_score": score,
        }
        chunk.update(metadata)
        retrieved_chunks.append(chunk)

    retrieved_chunks.sort(key=lambda x: x["final_score"], reverse=True)

    return retrieved_chunks