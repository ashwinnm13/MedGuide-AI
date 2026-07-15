import re

from rank_bm25 import BM25Okapi

from app.ingest.chroma_store import collection

bm25 = None
documents = []


def _tokenize(text: str):
    return re.findall(r"\b\w+\b", text.lower())


def _normalize_metadata(metadata: dict | None):
    normalized = dict(metadata or {})

    if "title" not in normalized:
        if "filename" in normalized:
            normalized["title"] = normalized["filename"].rsplit(".", 1)[0].replace("_", " ").title()
        elif "document" in normalized:
            normalized["title"] = str(normalized["document"]).replace("_", " ").title()
        else:
            normalized["title"] = "Untitled document"

    if "title" in normalized and isinstance(normalized["title"], str):
        normalized["title"] = normalized["title"].replace("Cdc", "CDC")

    normalized.pop("filename", None)
    return normalized


def build_bm25_index():
    """
    Load every chunk from ChromaDB and build an in-memory BM25 index.
    """
    global bm25, documents

    result = collection.get(include=["documents", "metadatas"])
    raw_documents = result.get("documents", []) or []
    raw_metadatas = result.get("metadatas", []) or []

    indexed_documents = []
    tokenized_documents = []

    for index, text in enumerate(raw_documents):
        if not text:
            continue

        metadata = raw_metadatas[index] if index < len(raw_metadatas) else {}
        indexed_documents.append({"text": text, "metadata": dict(metadata or {})})
        tokenized_documents.append(_tokenize(text))

    documents = indexed_documents
    bm25 = BM25Okapi(tokenized_documents) if tokenized_documents else None

    return documents


def search_bm25(query: str, top_k: int = 5):
    """
    Search the BM25 index and return results in the same schema as the semantic retriever.
    """
    global bm25

    if bm25 is None:
        build_bm25_index()

    if bm25 is None or not documents:
        return []

    tokenized_query = _tokenize(query)
    if not tokenized_query:
        return []

    scores = bm25.get_scores(tokenized_query)
    ranked_indices = sorted(range(len(scores)), key=lambda idx: scores[idx], reverse=True)[:top_k]

    results = []
    for index in ranked_indices:
        chunk = documents[index]
        metadata = _normalize_metadata(chunk.get("metadata", {}))
        result_item = {
            "text": chunk["text"],
            "score": round(float(scores[index]), 4),
        }
        result_item.update(metadata)
        results.append(result_item)

    return results
