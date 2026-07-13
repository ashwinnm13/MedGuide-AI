from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.ingest.metadata import generate_metadata


def chunk_documents(documents):
    """
    Split cleaned documents into overlapping chunks.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
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