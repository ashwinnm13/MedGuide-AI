import re

def attach_citations(answer: str, sources: list[dict]) -> str:
    if not sources:
        return answer
    
    cited_indices = set(map(int, re.findall(r'\[(\d+)\]', answer)))
    
    citations = []
    for i, source in enumerate(sources, 1):
        if cited_indices and i not in cited_indices:
            continue
            
        title = source.get("title", "Unknown Source")
        page = source.get("page")
        if page:
            citations.append(f"[{i}] {title} (Page {page})")
        else:
            citations.append(f"[{i}] {title}")
    
    citations_text = "\n".join(citations)
    return f"{answer}\n\nSources:\n{citations_text}"
