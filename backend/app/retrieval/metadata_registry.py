KNOWN_DOCUMENT_METADATA = {
    "cdc_opioid_guideline": {
        "title": "2022 CDC Clinical Practice Guideline for Prescribing Opioids for Pain",
        "organization": "CDC",
        "publication_year": 2022,
        "version": "2022",
    },
    "cdc_opiod_guideline": {
        "title": "2022 CDC Clinical Practice Guideline for Prescribing Opioids for Pain",
        "organization": "CDC",
        "publication_year": 2022,
        "version": "2022",
    },
    "opioid_guideline": {
        "title": "2022 CDC Clinical Practice Guideline for Prescribing Opioids for Pain",
        "organization": "CDC",
        "publication_year": 2022,
        "version": "2022",
    },
    "default": {
        "title": "Clinical Guideline",
        "organization": "Unknown",
        "publication_year": None,
        "version": None,
    },
}


def get_document_metadata(document_key: str | None):
    if not document_key:
        return dict(KNOWN_DOCUMENT_METADATA["default"])

    normalized_key = str(document_key).strip().lower().replace("-", "_")
    return dict(KNOWN_DOCUMENT_METADATA.get(normalized_key, KNOWN_DOCUMENT_METADATA["default"]))
