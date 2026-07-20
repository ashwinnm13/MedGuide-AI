from app.api.routes import chat
from app.schemas.retrieval import ChatRequest


def test_chat_returns_answer_and_sources(monkeypatch):
    captured = {}

    class FakeGraph:
        def invoke(self, state):
            captured["query"] = state.get("query")
            return {
                "answer": "Acute pain is short-term pain.",
                "sources": [
                    {"title": "CDC guidance", "page": 18},
                    {"title": "Another guide", "page": 22},
                ],
                "verification": {"supported": True, "reason": "Test verified."}
            }

    monkeypatch.setattr("app.api.routes.graph", FakeGraph())

    response = chat(ChatRequest(query="What is acute pain?", top_k=2))

    assert response == {
        "answer": "Acute pain is short-term pain.",
        "sources": [
            {"title": "CDC guidance", "page": 18},
            {"title": "Another guide", "page": 22},
        ],
        "verification": {"supported": True, "reason": "Test verified."}
    }
    assert captured == {"query": "What is acute pain?"}
