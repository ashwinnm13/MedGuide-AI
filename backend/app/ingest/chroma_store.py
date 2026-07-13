import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import settings

client = chromadb.PersistentClient(
    path=settings.chroma_path,
    settings=ChromaSettings(anonymized_telemetry=False)
)

collection = client.get_or_create_collection(
    name="medical_guidelines"
)


def add_chunk(chunk, embedding):
    """
    Store a single chunk in ChromaDB.
    """

    collection.add(
        ids=[chunk["chunk_id"]],
        documents=[chunk["text"]],
        embeddings=[embedding],
        metadatas=[chunk["metadata"]],
    )


def get_existing_chunk_ids(ids):
    """
    Return the existing chunk ids from ChromaDB for the provided ids.
    """
    if not ids:
        return []

    result = collection.get(ids=ids, include=["metadatas"])
    return list(result.get("ids", []))


def count_chunks():
    """
    Return the number of stored chunks.
    """
    return collection.count()
