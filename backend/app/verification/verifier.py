from __future__ import annotations

import json
from app.llm.ollama_client import generate_from_ollama
from app.llm.openrouter_client import generate_from_openrouter
from app.verification.prompt import VERIFICATION_PROMPT


def _parse_json_response(raw_text: str) -> dict:
    """Robustly parse a JSON response containing 'supported' and 'reason' keys."""
    cleaned = raw_text.strip()

    # Remove markdown code block formatting if present
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        start_line = 1
        # If the first line starts with ```, we skip it
        if lines and lines[0].startswith("```"):
            start_line = 1
        end_line = len(lines)
        if lines and lines[-1].startswith("```"):
            end_line = -1
        cleaned = "\n".join(lines[start_line:end_line]).strip()

    # Find the outer JSON object boundaries if it is surrounded by other text
    if not (cleaned.startswith("{") and cleaned.endswith("}")):
        start_idx = cleaned.find("{")
        end_idx = cleaned.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            cleaned = cleaned[start_idx : end_idx + 1]

    try:
        data = json.loads(cleaned)
        if not isinstance(data, dict):
            return {
                "supported": False,
                "reason": f"Response JSON was not an object. Raw response: {raw_text}",
            }

        # Handle 'supported' key
        supported_val = data.get("supported")
        if isinstance(supported_val, str):
            supported = supported_val.strip().lower() in ("true", "yes", "1")
        else:
            supported = bool(supported_val)

        # Handle 'reason' key
        reason = data.get("reason")
        if not isinstance(reason, str):
            reason = str(reason) if reason is not None else "No reason provided."

        return {
            "supported": supported,
            "reason": reason,
        }
    except json.JSONDecodeError:
        return {
            "supported": False,
            "reason": f"Failed to parse response as JSON. Raw response: {raw_text}",
        }


def verify_answer(
    question: str,
    answer: str,
    retrieved_chunks: list[dict],
) -> dict:
    """Verify if the generated answer is supported by the retrieved evidence."""
    # Combine retrieved chunks
    texts = [chunk.get("text", "") for chunk in retrieved_chunks if chunk.get("text")]
    context = "\n\n".join(texts) if texts else "No supporting context provided."

    # Build verification prompt
    prompt = VERIFICATION_PROMPT.format(
        question=question,
        answer=answer,
        context=context,
    )

    # Call the LLM (OpenRouter with Ollama fallback)
    try:
        raw_response = generate_from_openrouter(prompt)
    except Exception as e:
        # Fallback to Ollama if OpenRouter fails or is not configured
        try:
            raw_response = generate_from_ollama(prompt)
        except Exception as ollama_err:
            return {
                "supported": False,
                "reason": f"Failed to verify answer: LLM calls failed. OpenRouter error: {e}. Ollama error: {ollama_err}",
            }

    # Parse and return JSON response
    return _parse_json_response(raw_response)
