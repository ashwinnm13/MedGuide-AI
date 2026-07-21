from app.websearch.tavily_client import search_web


def test_search_web():
    results = search_web("latest WHO hypertension guidelines")

    assert isinstance(results, list)

    if results:
        assert "title" in results[0]
        assert "url" in results[0]
        assert "content" in results[0]