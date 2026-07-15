import logging

from fastapi import APIRouter

from app.retrieval.hybrid_retriever import hybrid_retrieve
from app.schemas.retrieval import (
    RetrieveRequest,
    RetrieveResponse,
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