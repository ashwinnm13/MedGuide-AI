from __future__ import annotations

from langgraph.graph import END, StateGraph

import app.graph.nodes as graph_nodes
from app.graph.state import GraphState


from app.graph.router import route_query

def route_function(state: GraphState):
    return state["route"]

def build_graph():
    workflow = StateGraph(GraphState)
    workflow.add_node("router", route_query)
    workflow.add_node("retrieve", graph_nodes.retrieve_node)
    workflow.add_node("web_search", graph_nodes.web_search_node)
    workflow.add_node("generate", graph_nodes.generate_node)
    workflow.add_node("verify", graph_nodes.verify_node)

    workflow.set_entry_point("router")
    
    workflow.add_conditional_edges(
        "router",
        route_function,
        {
            "local": "retrieve",
            "web": "web_search",
        },
    )

    workflow.add_edge("retrieve", "generate")
    workflow.add_edge("web_search", "generate")
    workflow.add_edge("generate", "verify")
    workflow.add_edge("verify", END)
    return workflow.compile()


graph = build_graph()
