from app.ingest.chroma_store import collection

print(f"Total Chunks: {collection.count()}")

result = collection.peek(limit=3)
print(result)
