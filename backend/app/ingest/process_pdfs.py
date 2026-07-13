from app.ingest.loader import load_pdfs
from app.ingest.cleaner import clean_text
from app.ingest.chunker import chunk_documents


def main():

    docs = load_pdfs()

    for doc in docs:
        doc["text"] = clean_text(doc["text"])

    chunks = chunk_documents(docs)

    print(f"Loaded Pages : {len(docs)}")
    print(f"Generated Chunks : {len(chunks)}")

    print("\nFirst Chunk\n")
    print(chunks[0])


if __name__ == "__main__":
    main()