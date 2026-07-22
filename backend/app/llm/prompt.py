from __future__ import annotations

import re
from collections.abc import Sequence


DEFAULT_FALLBACK = (
    "I could not find this information in the provided clinical guidelines."
)


def _clean_chunk(text: str) -> str:
    """Fix common PDF extraction artifacts before sending text to the LLM."""
    # Remove spaces before punctuation: "age ." -> "age."
    text = re.sub(r'\s+([.,;:!?])', r'\1', text)
    # Collapse multiple spaces
    text = re.sub(r'  +', ' ', text)
    return text.strip()


def build_prompt(retrieved_chunks: Sequence[str] | str, question: str) -> str:
    """Convert retrieved guideline chunks into a grounded prompt for the LLM."""
    if isinstance(retrieved_chunks, str):
        chunks = [retrieved_chunks]
    else:
        chunks = [chunk for chunk in retrieved_chunks if chunk]

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        if chunk:
            cleaned = _clean_chunk(chunk)
            context_parts.append(f"--- Source [{i}] ---\n{cleaned}")
            
    context_block = "\n\n".join(context_parts) if context_parts else "No supporting context provided."

    return (
        "You are MedGuide AI.\n\n"
        "If the user asks about a condition or medical term, first define it using the provided context if a definition is present. Do not introduce outside definitions not found in the context.\n"
        "Do not use conversational openings, greetings, or meta-commentary (e.g., \"What a great set of search results!\", \"As a medical assistant...\", \"Based on the search results...\"). Start directly with the factual clinical answer.\n"
        "Answer ONLY using the provided medical guideline context.\n"
        "Do not use outside knowledge or mention internal retrieval details.\n"
        "Cite the sources you use by appending their bracketed numbers at the end of the relevant sentences (e.g., [1], [2]).\n"
        "Do not copy any citation or reference numbers from the source documents. This includes bracketed numbers like [50], parenthetical numbers like (12) or (48)(49), superscript numbers, and any other reference markers from the original text. Strip them entirely from your response.\n"
        "Use only the Source [1], [2], etc. labels provided above to cite your answer.\n"
        "Do not use phrases like 'Source [1] says'.\n"
        "Write a complete but concise answer that sounds like a natural clinical guideline response.\n"
        "Use smooth, professional language. Avoid copying awkward phrasing or fragmented sentences from the context.\n"
        "Prefer full sentences, not bare phrases.\n"
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
