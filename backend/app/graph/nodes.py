from __future__ import annotations

from app.graph.state import GraphState
from app.llm.generator import generate_answer
from app.retrieval.hybrid_retriever import hybrid_retrieve


def retrieve_node(state: GraphState) -> dict:
    """Retrieve supporting chunks for the user's query."""
    query = state.get("query", "")
    chunks = hybrid_retrieve(query=query, top_k=5)
    return {"retrieved_chunks": chunks}


def generate_node(state: GraphState) -> dict:
    """Generate an answer from the retrieved context."""
    query = state.get("query", "")
    retrieved_chunks = state.get("retrieved_chunks", [])
    answer = generate_answer(query=query, retrieved_chunks=retrieved_chunks)
    return {"generated_answer": answer}


def verify_node(state: GraphState) -> dict:
    """Validate the generated answer and copy the final answer/sources."""
    answer = state.get("generated_answer", "")
    retrieved_chunks = state.get("retrieved_chunks", [])

    return {
        "verification": "passed" if answer else "failed",
        "answer": answer,
        "sources": [
            {
                "title": str(chunk.get("title") or "Untitled document"),
                "page": chunk.get("page"),
            }
            for chunk in retrieved_chunks
            if isinstance(chunk, dict)
        ],
    }
