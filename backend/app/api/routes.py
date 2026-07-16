import logging

from fastapi import APIRouter

from app.llm.generator import generate_answer
from app.retrieval.hybrid_retriever import hybrid_retrieve
from app.schemas.retrieval import (
    ChatRequest,
    ChatResponse,
    RetrieveRequest,
    RetrieveResponse,
    SourceItem,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/retrieve",
    response_model=RetrieveResponse,
)
def retrieve_documents(request: RetrieveRequest):
    results = hybrid_retrieve(
        query=request.query,
        top_k=request.top_k,
    )

    logger.info(
        "Retrieve request completed",
        extra={
            "query": request.query,
            "top_k": request.top_k,
            "final_results": len(results),
        },
    )

    return {"results": results}


@router.post(
    "/chat",
    response_model=ChatResponse,
)
def chat(request: ChatRequest):
    answer = generate_answer(request.query)
    results = hybrid_retrieve(query=request.query, top_k=request.top_k)

    sources = [
        {
            "title": str(chunk.get("title") or "Untitled document"),
            "page": chunk.get("page"),
        }
        for chunk in results
        if isinstance(chunk, dict)
    ]

    logger.info(
        "Chat request completed",
        extra={
            "query": request.query,
            "top_k": request.top_k,
            "answer_length": len(answer),
            "source_count": len(sources),
        },
    )

    return {"answer": answer, "sources": sources}