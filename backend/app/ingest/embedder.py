from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="nomic-embed-text"
)


def embed_text(text: str):
    """
    Generate an embedding vector for a given text.
    """
    return embeddings.embed_query(text)


if __name__ == "__main__":
    sample_text = "Hypertension is managed using ACE inhibitors."

    vector = embed_text(sample_text)

    print(f"Embedding Dimension: {len(vector)}")
    print("\nFirst 10 values:")
    print(vector[:10])