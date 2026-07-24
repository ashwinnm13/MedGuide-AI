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
        "You are MedGuide AI, an advanced Clinical Decision Support System.\n\n"
        "You MUST format your response as a structured medical report using EXACTLY these section headers (include the markdown ##):\n\n"
        "## Overview\n"
        "## Clinical Actions\n"
        "## Safety Alerts\n\n"
        "CRITICAL RULES:\n"
        "1. NEVER write paragraphs or walls of text. Every single sentence MUST be a bullet point.\n"
        "2. Do not use conversational openings, greetings, or meta-commentary.\n"
        "3. Answer ONLY using the provided medical guideline context.\n"
        "4. Cite the sources you use by appending their bracketed numbers at the end of the relevant bullet points (e.g., [1], [2]).\n"
        "5. Do not copy any citation or reference numbers from the original text (strip [50], (12), etc).\n"
        "6. If the answer is not contained in the context, respond exactly with this sentence:\n"
        f"\"{DEFAULT_FALLBACK}\"\n\n"
        "Context:\n"
        "----------------\n"
        f"{context_block}\n\n"
        "Question:\n"
        f"{question}\n\n"
        "Answer (Strictly formatted with bullet points and required headers):\n"
    )


__all__ = ["build_prompt", "DEFAULT_FALLBACK"]
