from __future__ import annotations

from app.graph.state import GraphState
from app.llm.generator import generate_answer, generate_from_web
from app.retrieval.hybrid_retriever import hybrid_retrieve
from app.verification import verify_answer
from app.websearch.search import web_search
from app.citation.formatter import attach_citations


def web_search_node(state: GraphState) -> GraphState:
    query = state.get("query", "")
    results = web_search(query)
    print(f"DEBUG WEB RESULTS: {len(results)} results found")
    state["web_results"] = results
    return state

def retrieve_node(state: GraphState) -> dict:
    """Retrieve supporting chunks for the user's query."""
    query = state.get("query", "")
    chunks = hybrid_retrieve(query=query, top_k=5)
    return {"retrieved_chunks": chunks}


def generate_node(state: GraphState) -> dict:
    """Generate an answer from local or web context."""
    query = state.get("query", "")
    route = state.get("route", "local")

    if route == "web":
        web_results = state.get("web_results", [])
        answer = generate_from_web(query=query, web_results=web_results)
    else:
        retrieved_chunks = state.get("retrieved_chunks", [])
        answer = generate_answer(query=query, retrieved_chunks=retrieved_chunks)

    return {"generated_answer": answer}


def verify_node(state: GraphState) -> dict:
    """Validate the generated answer and copy the final answer/sources."""
    query = state.get("query", "")
    answer = state.get("generated_answer", "")
    route = state.get("route", "local")
    retrieved_chunks = state.get("retrieved_chunks", [])
    web_results = state.get("web_results", [])

    # Build sources from the appropriate path
    if route == "web" and web_results:
        sources = [
            {
                "title": r.get("title", "Web source"),
                "url": r.get("url", ""),
                "source_type": "web"
            }
            for r in web_results
        ]
    else:
        sources = [
            {
                "title": str(chunk.get("title") or "Untitled document"),
                "page": chunk.get("page"),
                "source_type": "local",
            }
            for chunk in retrieved_chunks
            if isinstance(chunk, dict)
        ]

    # Attach citations
    cited_answer, unique_sources = attach_citations(answer, sources)

    # Build context for verification from whichever source was used
    if route == "web" and web_results:
        verification_chunks = [
            {"text": r.get("content", ""), "title": r.get("title", "")}
            for r in web_results
        ]
    else:
        verification_chunks = retrieved_chunks

    verification_result = verify_answer(
        question=query,
        answer=cited_answer,
        retrieved_chunks=verification_chunks,
    )

    return {
        "verification": verification_result,
        "answer": cited_answer,
        "sources": unique_sources,
    }
