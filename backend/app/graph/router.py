from app.graph.state import GraphState


WEB_KEYWORDS = {
    "latest",
    "recent",
    "today",
    "current",
    "new",
    "updated",
    "news",
    "guideline",
    "2025",
    "2026",
}


def route_query(state: GraphState) -> GraphState:
    query = state.get("query", "").lower()

    if any(keyword in query for keyword in WEB_KEYWORDS):
        state["route"] = "web"
    else:
        state["route"] = "local"

    return state
