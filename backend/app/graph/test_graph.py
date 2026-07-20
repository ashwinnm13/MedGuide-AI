import importlib

import app.graph.nodes as graph_nodes


def test_generate_node_uses_retrieved_chunks(monkeypatch):
    captured = {}

    def fake_generate_answer(query, retrieved_chunks=None):
        captured["query"] = query
        captured["retrieved_chunks"] = retrieved_chunks
        return "Acute pain is short-term pain."

    monkeypatch.setattr(graph_nodes, "generate_answer", fake_generate_answer)

    result = graph_nodes.generate_node(
        {
            "query": "acute pain",
            "retrieved_chunks": [{"text": "Acute pain guidance.", "title": "CDC"}],
        }
    )

    assert captured["query"] == "acute pain"
    assert captured["retrieved_chunks"] == [{"text": "Acute pain guidance.", "title": "CDC"}]
    assert result == {"generated_answer": "Acute pain is short-term pain."}


def test_graph_invokes_retrieve_generate_verify(monkeypatch):
    calls = []

    def fake_retrieve(state):
        calls.append("retrieve")
        state["retrieved_chunks"] = [{"text": "Acute pain is short-term pain.", "title": "CDC"}]
        return state

    def fake_generate(state):
        calls.append("generate")
        state["generated_answer"] = "Acute pain is short-term pain."
        return state

    def fake_verify(state):
        calls.append("verify")
        state["answer"] = state["generated_answer"]
        state["sources"] = [
            {"title": chunk.get("title", "Untitled document")}
            for chunk in state["retrieved_chunks"]
        ]
        return state

    monkeypatch.setattr(graph_nodes, "retrieve_node", fake_retrieve)
    monkeypatch.setattr(graph_nodes, "generate_node", fake_generate)
    monkeypatch.setattr(graph_nodes, "verify_node", fake_verify)

    import app.graph.workflow as workflow_module

    importlib.reload(workflow_module)

    result = workflow_module.graph.invoke({"query": "acute pain"})

    assert calls[:3] == ["retrieve", "generate", "verify"]
    assert result["answer"] == "Acute pain is short-term pain."
    assert result["sources"] == [{"title": "CDC"}]
