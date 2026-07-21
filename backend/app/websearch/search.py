from app.websearch.tavily_client import search_web as tavily_search_web

def web_search(query: str) -> list[dict]:
    """Execute web search flow."""
    return tavily_search_web(query)
