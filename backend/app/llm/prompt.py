from __future__ import annotations

from collections.abc import Sequence


DEFAULT_FALLBACK = (
    "I could not find this information in the provided clinical guidelines."
)


def build_prompt(retrieved_chunks: Sequence[str] | str, question: str) -> str:
    """Convert retrieved guideline chunks into a grounded prompt for the LLM."""
    if isinstance(retrieved_chunks, str):
        chunks = [retrieved_chunks]
    else:
        chunks = [chunk for chunk in retrieved_chunks if chunk]

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        if chunk:
            context_parts.append(f"--- Source [{i}] ---\n{chunk}")
            
    context_block = "\n\n".join(context_parts) if context_parts else "No supporting context provided."

    return (
        "You are MedGuide AI.\n\n"
        "If the user asks about a condition or medical term, first define it based on the context before providing recommendations.\n"
        "Answer ONLY using the provided medical guideline context.\n"
        "Do not use outside knowledge or mention internal retrieval details.\n"
        "Cite the sources you use by appending their bracketed numbers at the end of the relevant sentences (e.g., [1], [2]).\n"
        "Do not use phrases like 'Source [1] says'.\n"
        "Write a complete but concise answer that sounds like a clinical guideline response.\n"
        "Prefer a full sentence or two, not a bare phrase.\n"
        "If the context mentions a guideline title or source, include it naturally in the answer.\n"
        "If the answer is not contained in the context, respond exactly with this sentence:\n"
        f"\"{DEFAULT_FALLBACK}\"\n\n"
        "Context:\n"
        "----------------\n"
        f"{context_block}\n\n"
        "Question:\n"
        f"{question}\n\n"
        "Answer:\n"
    )


__all__ = ["build_prompt", "DEFAULT_FALLBACK"]
