import re

def _strip_leaked_refs(text: str, max_valid_idx: int) -> str:
    """Remove original guideline reference numbers that leaked into the LLM output.
    
    Strips patterns like (48), (48)(49), but preserves parenthetical content
    that looks like real data (e.g., OR values, confidence intervals).
    Also strips bracketed numbers [50] that exceed our valid source range.
    """
    # Remove parenthetical reference numbers: (48), (49), etc.
    # Only match bare numbers in parens, not things like (OR 0.66) or (95% CI ...)
    text = re.sub(r'\((\d{1,3})\)(?:\((\d{1,3})\))*', '', text)
    
    # Remove bracketed numbers that exceed our valid source range
    def _remove_invalid_brackets(match):
        num = int(match.group(1))
        if num > max_valid_idx:
            return ''
        return match.group(0)
    text = re.sub(r'\[(\d+)\]', _remove_invalid_brackets, text)
    
    # Clean up leftover double spaces
    text = re.sub(r'  +', ' ', text)
    
    return text.strip()


def _strip_conversational_phrases(text: str) -> str:
    """Remove common LLM conversational filler, openings, and meta-commentary."""
    text = re.sub(r'^(?:What a great set of search results!?\s*)', '', text, flags=re.IGNORECASE)
    pattern = r'^(?:As a medical assistant,?\s*(?:I\'m excited to share[^.!?\n]*[.!?]\s*|I can tell you that\s*|I can provide[^.!?\n]*[.!?]\s*)?|Based on the search results,?\s*|According to the search results,?\s*|Here are the search results:?\s*)'
    text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    text = text.strip()
    if text and text[0].islower():
        text = text[0].upper() + text[1:]
    return text


def attach_citations(answer: str, sources: list[dict]) -> tuple[str, list[dict]]:
    if not sources:
        return answer, []
    
    # Strip conversational intro phrases and leaked guideline references
    answer = _strip_conversational_phrases(answer)
    answer = _strip_leaked_refs(answer, max_valid_idx=len(sources))
    
    cited_indices = set(map(int, re.findall(r'\[(\d+)\]', answer)))
    
    # Track unique sources
    seen = {}
    unique_sources = []
    old_to_new_idx = {}
    new_idx = 1
    
    for i, source in enumerate(sources, 1):
        # If there are inline citations, skip unused sources
        if cited_indices and i not in cited_indices:
            continue
            
        key = (source.get("title"), source.get("page"), source.get("url"))
        if key not in seen:
            seen[key] = new_idx
            unique_sources.append(source)
            old_to_new_idx[i] = new_idx
            new_idx += 1
        else:
            old_to_new_idx[i] = seen[key]
            
    # Remap indices in the answer text
    if cited_indices:
        def replace_idx(match):
            old_val = int(match.group(1))
            if old_val in old_to_new_idx:
                return f"[{old_to_new_idx[old_val]}]"
            return match.group(0)
        answer = re.sub(r'\[(\d+)\]', replace_idx, answer)
    
    # Strip inline citation markers from the answer text
    # The sources JSON field handles attribution separately
    answer = re.sub(r'\s*\[\d+\]', '', answer)
    
    # Clean up spacing around punctuation
    answer = re.sub(r'\s+([.,;:!?])', r'\1', answer)
    answer = re.sub(r'  +', ' ', answer)
    
    return answer.strip(), unique_sources
