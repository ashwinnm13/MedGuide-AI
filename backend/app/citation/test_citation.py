from app.citation.formatter import attach_citations

def test_attach_citations_basic():
    answer = "Acute pain lasts less than one month."
    sources = [{"title": "CDC Guideline", "page": 18}]
    expected = "Acute pain lasts less than one month.\n\nSources:\n[1] CDC Guideline (Page 18)"
    assert attach_citations(answer, sources) == expected

def test_empty_sources():
    answer = "Acute pain lasts less than one month."
    sources = []
    expected = "Acute pain lasts less than one month."
    assert attach_citations(answer, sources) == expected

def test_missing_page():
    answer = "Acute pain lasts less than one month."
    sources = [{"title": "CDC Guideline"}]
    expected = "Acute pain lasts less than one month.\n\nSources:\n[1] CDC Guideline"
    assert attach_citations(answer, sources) == expected

def test_multiple_sources():
    answer = "Acute pain lasts less than one month."
    sources = [
        {"title": "CDC Guideline", "page": 18},
        {"title": "WHO Guideline", "page": 22}
    ]
    expected = "Acute pain lasts less than one month.\n\nSources:\n[1] CDC Guideline (Page 18)\n[2] WHO Guideline (Page 22)"
    assert attach_citations(answer, sources) == expected
