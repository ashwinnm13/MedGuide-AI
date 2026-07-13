import re


def clean_text(text: str) -> str:
    """
    Clean extracted PDF text.
    """

    if not text:
        return ""

    # Remove null characters
    text = text.replace("\x00", "")

    # Normalize all whitespace (spaces, tabs, newlines)
    text = re.sub(r"\s+", " ", text)

    # Remove spaces before punctuation
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)

    return text.strip()