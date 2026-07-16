from __future__ import annotations

from app.core.config import settings

try:
    from ollama import Client
except ImportError:  # pragma: no cover - handled in environments without the dependency
    Client = None


def _extract_text_from_ollama_response(response: object) -> str:
    """Normalize Ollama SDK responses to plain assistant text."""
    if response is None:
        return ""

    if isinstance(response, dict):
        if "response" in response and isinstance(response["response"], str):
            return response["response"]
        if "message" in response and isinstance(response["message"], dict):
            content = response["message"].get("content")
            if isinstance(content, str):
                return content
        if "content" in response and isinstance(response["content"], str):
            return response["content"]
        return ""

    message = getattr(response, "message", None)
    if isinstance(message, dict):
        content = message.get("content")
        if isinstance(content, str):
            return content

    content = getattr(message, "content", None)
    if isinstance(content, str):
        return content

    response_text = getattr(response, "response", None)
    if isinstance(response_text, str):
        return response_text

    content_attr = getattr(response, "content", None)
    if isinstance(content_attr, str):
        return content_attr

    return ""


def generate_from_ollama(prompt: str) -> str:
    """Send a prompt to Ollama and return the generated response text."""
    if Client is None:
        raise RuntimeError("The 'ollama' package is not installed.")

    host = settings.ollama_base_url or "http://localhost:11434"
    client = Client(host=host)
    response = client.generate(model=settings.model_name, prompt=prompt, stream=False)

    return _extract_text_from_ollama_response(response)


__all__ = ["generate_from_ollama"]
