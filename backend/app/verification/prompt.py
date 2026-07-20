from __future__ import annotations

VERIFICATION_PROMPT = """You are an evidence verification assistant.

Question:
{question}

Answer:
{answer}

Evidence:
{context}

Determine whether the answer is fully supported by the evidence.

Respond ONLY with JSON:

{{
  "supported": true,
  "reason": "..."
}}"""

__all__ = ["VERIFICATION_PROMPT"]
