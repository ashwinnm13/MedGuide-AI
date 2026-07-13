from __future__ import annotations

import re
from pathlib import Path

KNOWN_DOCUMENT_METADATA = {
    "cdc_opiod_guideline": {
        "title": "CDC Clinical Practice Guideline for Prescribing Opioids for Pain",
        "organization": "CDC",
        "source": "CDC Guidelines",
        "publication_year": 2022,
        "version": "2022",
    },
}

DEFAULT_ORGANIZATIONS = {
    "who": "WHO",
    "cdc": "CDC",
    "nih": "NIH",
    "nhlbi": "NHLBI",
}

YEAR_PATTERN = re.compile(r"\b(19|20)\d{2}\b")


def parse_publication_year(document_id: str) -> int | None:
    match = YEAR_PATTERN.search(document_id)
    return int(match.group(0)) if match else None


def infer_metadata(filename: str) -> dict:
    document_id = Path(filename).stem
    override = KNOWN_DOCUMENT_METADATA.get(document_id, {})
    organization = override.get(
        "organization",
        next((org for prefix, org in DEFAULT_ORGANIZATIONS.items() if document_id.startswith(prefix)), "Unknown"),
    )
    source = override.get("source", f"{organization} Guidelines" if organization != "Unknown" else "Clinical Guideline PDF")
    publication_year = override.get("publication_year", parse_publication_year(document_id))
    title = override.get("title", document_id.replace("_", " ").title())

    return {
        "document_id": document_id,
        "document": document_id,
        "title": title,
        "organization": organization,
        "source": source,
        "publication_year": publication_year,
        "version": override.get("version"),
        "filename": filename,
    }


def generate_metadata(chunk: dict) -> dict:
    """
    Generate metadata for every chunk.
    """
    metadata = infer_metadata(chunk["filename"])
    metadata.update(
        {
            "page": chunk["page"],
            "chunk_id": chunk["chunk_id"],
        }
    )
    return metadata
