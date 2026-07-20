from __future__ import annotations

from app.llm.ollama_client import generate_from_ollama
from app.llm.openrouter_client import generate_from_openrouter
from app.llm.prompt import build_prompt
from app.retrieval.hybrid_retriever import hybrid_retrieve


def _normalize_answer_text(answer: object) -> str:
    if isinstance(answer, str):
        return answer
    if answer is None:
        return ""
    if isinstance(answer, dict):
        if "response" in answer and isinstance(answer["response"], str):
            return answer["response"]
        if "message" in answer and isinstance(answer["message"], dict):
            content = answer["message"].get("content")
            if isinstance(content, str):
                return content
        if "content" in answer and isinstance(answer["content"], str):
            return answer["content"]
    message = getattr(answer, "message", None)
    if isinstance(message, dict):
        content = message.get("content")
        if isinstance(content, str):
            return content
    content = getattr(message, "content", None)
    if isinstance(content, str):
        return content
    response_text = getattr(answer, "response", None)
    if isinstance(response_text, str):
        return response_text
    content_attr = getattr(answer, "content", None)
    if isinstance(content_attr, str):
        return content_attr
    return str(answer)


def generate_answer(query: str, retrieved_chunks: list[dict] | None = None) -> str:
    """Retrieve context, build a grounded prompt, and generate an answer."""
    if retrieved_chunks is None:
        retrieved_chunks = hybrid_retrieve(query=query, top_k=5)
    texts = [chunk.get("text", "") for chunk in retrieved_chunks if chunk.get("text")]

    prompt = build_prompt(texts, query)

    try:
        return _normalize_answer_text(generate_from_openrouter(prompt))
    except Exception:
        return _normalize_answer_text(generate_from_ollama(prompt))
