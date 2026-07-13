import logging

from app.core.config import settings
from langchain_ollama import OllamaEmbeddings

logger = logging.getLogger(__name__)

embeddings = OllamaEmbeddings(
    model=settings.embed_model or settings.model_name,
    base_url=settings.ollama_base_url,
)


def embed_text(text: str):
    """
    Generate an embedding vector for a given text.
    """
    return embeddings.embed_query(text)


if __name__ == "__main__":
    logger.info("Embedding sample text using model=%s", settings.embed_model or settings.model_name)

    sample_text = "Hypertension is managed using ACE inhibitors."
    vector = embed_text(sample_text)

    logger.info("Embedding Dimension: %d", len(vector))
    logger.info("First 10 values: %s", vector[:10])
