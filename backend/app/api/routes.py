from fastapi import APIRouter

from app.retrieval.retriever import retrieve
from app.schemas.retrieval import (
    RetrieveRequest,
    RetrieveResponse,
)

router = APIRouter()


@router.post(
    "/retrieve",
    response_model=RetrieveResponse,
)
def retrieve_documents(request: RetrieveRequest):
    results = retrieve(
        query=request.query,
        top_k=request.top_k,
    )

    return {"results": results}