from app.ingest.loader import load_pdfs
from app.ingest.cleaner import clean_text
from langchain_text_splitters import RecursiveCharacterTextSplitter


def main():
    docs = load_pdfs()[:20]
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    print("Page,raw_chars,clean_chars,chunk_count")
    for doc in docs:
        raw = doc["text"] or ""
        clean = clean_text(raw)
        chunks = splitter.split_text(clean)
        print(f"{doc['page']},{len(raw)},{len(clean)},{len(chunks)}")


if __name__ == '__main__':
    main()
