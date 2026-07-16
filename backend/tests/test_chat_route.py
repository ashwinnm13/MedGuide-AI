from app.api.routes import chat
from app.schemas.retrieval import ChatRequest


def test_chat_returns_answer_and_sources(monkeypatch):
    captured = {}

    def fake_generate_answer(query):
        captured["query"] = query
        return "Acute pain is short-term pain."

    def fake_hybrid(query, top_k):
        captured["top_k"] = top_k
        return [
            {
                "title": "CDC guidance",
                "page": 18,
            },
            {
                "title": "Another guide",
                "page": 22,
            },
        ]

    monkeypatch.setattr("app.api.routes.generate_answer", fake_generate_answer)
    monkeypatch.setattr("app.api.routes.hybrid_retrieve", fake_hybrid)

    response = chat(ChatRequest(query="What is acute pain?", top_k=2))

    assert response == {
        "answer": "Acute pain is short-term pain.",
        "sources": [
            {"title": "CDC guidance", "page": 18},
            {"title": "Another guide", "page": 22},
        ],
    }
    assert captured == {"query": "What is acute pain?", "top_k": 2}
