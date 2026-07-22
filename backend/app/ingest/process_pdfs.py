import logging

from app.core.config import configure_logging
from app.ingest.cleaner import clean_text
from app.ingest.chunker import chunk_documents
from app.ingest.chroma_store import add_chunk, count_chunks, get_existing_chunk_ids
from app.ingest.embedder import embed_text
from app.ingest.loader import load_pdfs

logger = logging.getLogger(__name__)


def main():
    configure_logging()
    logger.info("Starting ingestion pipeline")

    docs = load_pdfs()
    for doc in docs:
        doc["text"] = clean_text(doc["text"])

    chunks = chunk_documents(docs)
    logger.info("Loaded pages: %d", len(docs))
    logger.info("Generated chunks: %d", len(chunks))

    all_chunk_ids = [chunk["chunk_id"] for chunk in chunks]
    existing_chunk_ids = set(get_existing_chunk_ids(all_chunk_ids))
    inserted = 0
    skipped = 0

    for chunk in chunks:
        if chunk["chunk_id"] in existing_chunk_ids:
            skipped += 1
            logger.info("Skipping existing chunk %s", chunk["chunk_id"])
            continue

        embedding = embed_text(chunk["text"])
        add_chunk(chunk, embedding)
        inserted += 1

    logger.info("Inserted %d chunks", inserted)
    logger.info("Skipped %d existing chunks", skipped)
    logger.info("Done! Total chunks in ChromaDB: %d", count_chunks())


if __name__ == "__main__":
    main()
