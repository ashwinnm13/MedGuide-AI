from __future__ import annotations

from langgraph.graph import END, StateGraph

import app.graph.nodes as graph_nodes
from app.graph.state import GraphState


def build_graph():
    workflow = StateGraph(GraphState)
    workflow.add_node("retrieve", graph_nodes.retrieve_node)
    workflow.add_node("generate", graph_nodes.generate_node)
    workflow.add_node("verify", graph_nodes.verify_node)

    workflow.add_edge("retrieve", "generate")
    workflow.add_edge("generate", "verify")
    workflow.add_edge("verify", END)
    workflow.set_entry_point("retrieve")
    return workflow.compile()


graph = build_graph()
