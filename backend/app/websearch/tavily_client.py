import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

API_KEY = os.getenv("TAVILY_API_KEY")

client = TavilyClient(api_key=API_KEY) if API_KEY else None


def search_web(query: str) -> list[dict]:
    """Call Tavily and return clean results."""
    if client is None:
        print("Tavily client not initialized (missing API key). Skipping web search.")
        return []

    try:
        response = client.search(
            query=query,
            search_depth="advanced",
            max_results=5,
            # timeout=15 # Some versions of the tavily-python SDK don't support timeout directly in this method
        )

        return [
            {
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": item.get("content", ""),
                "score": item.get("score", 0),
            }
            for item in response.get("results", [])
        ]
    except Exception as e:
        print(f"Tavily search failed: {e}")
        return []
