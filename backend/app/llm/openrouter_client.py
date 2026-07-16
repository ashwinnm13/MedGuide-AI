from __future__ import annotations

import os

import requests

from app.core.config import settings


def generate_from_openrouter(prompt: str) -> str:
    """Send a prompt to OpenRouter and return the generated response text."""
    api_key = os.getenv("OPENROUTER_API_KEY") or getattr(settings, "openrouter_api_key", None)
    base_url = os.getenv("OPENROUTER_BASE_URL") or "https://openrouter.ai/api/v1"
    model = os.getenv("OPENROUTER_MODEL") or getattr(settings, "openrouter_model", "openai/gpt-4o-mini")

    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured.")

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You answer strictly from the provided context and do not use outside knowledge.",
            },
            {"role": "user", "content": prompt},
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        f"{base_url.rstrip('/')}/chat/completions",
        headers=headers,
        json=payload,
        timeout=60,
    )
    response.raise_for_status()

    data = response.json()
    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("OpenRouter returned no choices.")

    message = choices[0].get("message", {})
    content = message.get("content")
    if isinstance(content, list):
        parts = []
        for part in content:
            if isinstance(part, dict):
                text = part.get("text")
                if isinstance(text, str):
                    parts.append(text)
            elif isinstance(part, str):
                parts.append(part)
        return "".join(parts)

    if isinstance(content, str):
        return content

    return str(content or "")


__all__ = ["generate_from_openrouter"]
