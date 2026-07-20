from __future__ import annotations

import pytest
from app.graph.nodes import verify_node
from app.verification.prompt import VERIFICATION_PROMPT
from app.verification.verifier import _parse_json_response, verify_answer


def test_verification_prompt_structure():
    prompt = VERIFICATION_PROMPT.format(
        question="What is acute pain?",
        answer="Acute pain is short-term.",
        context="Acute pain lasts less than 1 month.",
    )
    assert "What is acute pain?" in prompt
    assert "Acute pain is short-term." in prompt
    assert "Acute pain lasts less than 1 month." in prompt
    assert "Respond ONLY with JSON:" in prompt


def test_parse_json_response_clean():
    raw = '{"supported": true, "reason": "The answer is supported."}'
    res = _parse_json_response(raw)
    assert res == {"supported": True, "reason": "The answer is supported."}


def test_parse_json_response_markdown():
    raw = """```json
{"supported": false, "reason": "The answer is not supported."}
```"""
    res = _parse_json_response(raw)
    assert res == {"supported": False, "reason": "The answer is not supported."}


def test_parse_json_response_surrounding_text():
    raw = """Here is the verification result:
{"supported": true, "reason": "Everything matches."}
Please let me know if you need anything else."""
    res = _parse_json_response(raw)
    assert res == {"supported": True, "reason": "Everything matches."}


def test_parse_json_response_coercion():
    raw = '{"supported": "true", "reason": 123}'
    res = _parse_json_response(raw)
    assert res == {"supported": True, "reason": "123"}


def test_parse_json_response_invalid():
    raw = "Not JSON at all"
    res = _parse_json_response(raw)
    assert res["supported"] is False
    assert "Failed to parse" in res["reason"]


def test_verify_answer_openrouter_success(monkeypatch):
    calls = []

    def mock_openrouter(prompt):
        calls.append("openrouter")
        return '{"supported": true, "reason": "From openrouter"}'

    monkeypatch.setattr("app.verification.verifier.generate_from_openrouter", mock_openrouter)

    res = verify_answer(
        question="Q",
        answer="A",
        retrieved_chunks=[{"text": "C1"}],
    )
    assert res == {"supported": True, "reason": "From openrouter"}
    assert calls == ["openrouter"]


def test_verify_answer_ollama_fallback(monkeypatch):
    calls = []

    def mock_openrouter(prompt):
        calls.append("openrouter")
        raise RuntimeError("Openrouter failed")

    def mock_ollama(prompt):
        calls.append("ollama")
        return '{"supported": false, "reason": "From ollama"}'

    monkeypatch.setattr("app.verification.verifier.generate_from_openrouter", mock_openrouter)
    monkeypatch.setattr("app.verification.verifier.generate_from_ollama", mock_ollama)

    res = verify_answer(
        question="Q",
        answer="A",
        retrieved_chunks=[{"text": "C1"}],
    )
    assert res == {"supported": False, "reason": "From ollama"}
    assert calls == ["openrouter", "ollama"]


def test_verify_answer_both_fail(monkeypatch):
    def mock_openrouter(prompt):
        raise RuntimeError("Openrouter failed")

    def mock_ollama(prompt):
        raise RuntimeError("Ollama failed")

    monkeypatch.setattr("app.verification.verifier.generate_from_openrouter", mock_openrouter)
    monkeypatch.setattr("app.verification.verifier.generate_from_ollama", mock_ollama)

    res = verify_answer(
        question="Q",
        answer="A",
        retrieved_chunks=[{"text": "C1"}],
    )
    assert res["supported"] is False
    assert "Failed to verify answer: LLM calls failed" in res["reason"]


def test_verify_node_execution(monkeypatch):
    def mock_verify_answer(question, answer, retrieved_chunks):
        return {"supported": True, "reason": "Verified!"}

    monkeypatch.setattr("app.graph.nodes.verify_answer", mock_verify_answer)

    state = {
        "query": "What is acute pain?",
        "generated_answer": "Acute pain is pain.",
        "retrieved_chunks": [{"title": "CDC Doc", "page": 10, "text": "Acute pain is pain."}],
    }

    res = verify_node(state)
    assert res["verification"] == {"supported": True, "reason": "Verified!"}
    assert res["answer"] == "Acute pain is pain."
    assert res["sources"] == [{"title": "CDC Doc", "page": 10}]
