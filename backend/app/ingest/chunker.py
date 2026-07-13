import logging

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings
from app.ingest.metadata import generate_metadata

logger = logging.getLogger(__name__)


def chunk_documents(documents):
    """
    Split cleaned documents into overlapping chunks.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            ""
        ]
    )

    chunks = []

    for doc in documents:
        text_chunks = splitter.split_text(doc["text"])
        logger.info("Page %s -> %s chunks", doc["page"], len(text_chunks))

        for idx, chunk in enumerate(text_chunks):
            chunk_data = {
                "chunk_id": f"{doc['filename']}_{doc['page']}_{idx}",
                "filename": doc["filename"],
                "page": doc["page"],
                "text": chunk,
            }

            # Attach metadata
            chunk_data["metadata"] = generate_metadata(chunk_data)

            chunks.append(chunk_data)

    return chunks