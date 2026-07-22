from app.citation.formatter import attach_citations

def test_attach_citations_basic():
    """Answer text should be clean; sources returned separately."""
    answer = "Acute pain lasts less than one month."
    sources = [{"title": "CDC Guideline", "page": 18}]
    result, unique = attach_citations(answer, sources)
    assert "Sources:" not in result
    assert len(unique) == 1
    assert unique[0]["page"] == 18

def test_empty_sources():
    answer = "Acute pain lasts less than one month."
    sources = []
    result, unique = attach_citations(answer, sources)
    assert result == "Acute pain lasts less than one month."
    assert unique == []

def test_missing_page():
    answer = "Acute pain lasts less than one month."
    sources = [{"title": "CDC Guideline"}]
    result, unique = attach_citations(answer, sources)
    assert "Sources:" not in result
    assert len(unique) == 1

def test_multiple_sources():
    answer = "Acute pain lasts less than one month."
    sources = [
        {"title": "CDC Guideline", "page": 18},
        {"title": "WHO Guideline", "page": 22}
    ]
    result, unique = attach_citations(answer, sources)
    assert "Sources:" not in result
    assert len(unique) == 2

def test_leaked_parenthetical_refs_stripped():
    """Guideline refs like (48)(49) should be removed."""
    answer = "Symptoms include fever and rash (48)(49) [1]."
    sources = [{"title": "Clinical Guideline", "page": 100}]
    result, _ = attach_citations(answer, sources)
    assert "(48)" not in result
    assert "(49)" not in result

def test_leaked_bracket_refs_stripped():
    """Bracket refs like [50] that exceed source count should be removed."""
    answer = "Pain is common [50] and treatable [1]."
    sources = [{"title": "CDC Guideline", "page": 18}]
    result, _ = attach_citations(answer, sources)
    assert "[50]" not in result

def test_deduplication():
    """Duplicate sources should be collapsed into one."""
    answer = "Pain [1] is treatable [2]."
    sources = [
        {"title": "CDC Guideline", "page": 18},
        {"title": "CDC Guideline", "page": 18},
    ]
    _, unique = attach_citations(answer, sources)
    assert len(unique) == 1

def test_no_sources_footer_in_answer():
    """The answer should never contain a Sources: footer."""
    answer = "Pain is common [1] and treatable [2]."
    sources = [
        {"title": "CDC Guideline", "page": 18},
        {"title": "WHO Guideline", "page": 22},
    ]
    result, _ = attach_citations(answer, sources)
    assert "Sources:" not in result
    assert "[1]" not in result
    assert "[2]" not in result

def test_spacing_cleaned():
    """Extra spaces before punctuation should be cleaned."""
    answer = "Pain is common [1] ."
    sources = [{"title": "CDC Guideline", "page": 18}]
    result, _ = attach_citations(answer, sources)
    assert " ." not in result


def test_conversational_phrases_stripped():
    """Conversational openings like 'What a great set of search results!' should be removed."""
    answer = "What a great set of search results! As a medical assistant, I'm excited to share the latest research. Diabetes treatment has evolved."
    sources = [{"title": "Medical Article", "url": "https://example.com"}]
    result, _ = attach_citations(answer, sources)
    assert "What a great set" not in result
    assert "As a medical assistant" not in result
    assert result == "Diabetes treatment has evolved."

