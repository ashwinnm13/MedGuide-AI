from pydantic import BaseModel


class RetrieveRequest(BaseModel):
    query: str
    top_k: int = 5


class ChatRequest(BaseModel):
    query: str
    top_k: int = 5


class SourceItem(BaseModel):
    title: str
    page: int | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceItem]


class RetrievedChunk(BaseModel):
    title: str
    document: str
    organization: str
    page: int
    chunk_id: str
    semantic_score: float
    bm25_score: float
    final_score: float
    text: str


class RetrieveResponse(BaseModel):
    results: list[RetrievedChunk]