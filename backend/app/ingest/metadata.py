from pathlib import Path


def generate_metadata(chunk: dict) -> dict:
    """
    Generate metadata for every chunk.
    """

    filename = Path(chunk["filename"]).stem

    organization = "Unknown"

    if filename.startswith("who"):
        organization = "WHO"

    elif filename.startswith("cdc"):
        organization = "CDC"

    elif filename.startswith("nih"):
        organization = "NIH"

    elif filename.startswith("nhlbi"):
        organization = "NHLBI"

    return {
        "chunk_id": chunk["chunk_id"],
        "filename": chunk["filename"],
        "document": filename,
        "organization": organization,
        "page": chunk["page"],
    }