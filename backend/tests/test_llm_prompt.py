from types import SimpleNamespace

from app.llm import ollama_client
from app.llm.prompt import build_prompt


def test_build_prompt_includes_guideline_context_and_fallback():
    chunks = [
        "Acute pain is pain lasting less than 3 months.",
        "Use conservative management first.",
    ]

    prompt = build_prompt(chunks, "What is acute pain?")

    assert "You are MedGuide AI." in prompt
    assert "Answer ONLY using the provided medical guideline context." in prompt
    assert "Acute pain is pain lasting less than 3 months." in prompt
    assert "Use conservative management first." in prompt
    assert "What is acute pain?" in prompt
    assert "I could not find this information in the provided clinical guidelines." in prompt


def test_generate_from_ollama_uses_client_response(monkeypatch):
    class FakeClient:
        def __init__(self, host):
            self.host = host

        def generate(self, model, prompt, stream=False):
            assert model == "llama3.2"
            assert prompt == "hello"
            assert stream is False
            return {"response": "Hello from Ollama"}

    monkeypatch.setattr(ollama_client, "Client", FakeClient)
    monkeypatch.setattr(
        ollama_client,
        "settings",
        SimpleNamespace(model_name="llama3.2", ollama_base_url="http://example:11434"),
    )

    assert ollama_client.generate_from_ollama("hello") == "Hello from Ollama"


def test_generate_from_ollama_extracts_message_content_from_object(monkeypatch):
    class FakeResponse:
        def __init__(self):
            self.message = SimpleNamespace(content="Hello from object")

    class FakeClient:
        def __init__(self, host):
            self.host = host

        def generate(self, model, prompt, stream=False):
            return FakeResponse()

    monkeypatch.setattr(ollama_client, "Client", FakeClient)
    monkeypatch.setattr(
        ollama_client,
        "settings",
        SimpleNamespace(model_name="llama3.2", ollama_base_url="http://example:11434"),
    )

    assert ollama_client.generate_from_ollama("hello") == "Hello from object"
