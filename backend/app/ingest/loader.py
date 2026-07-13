from pathlib import Path
import fitz

RAW_GUIDELINES = Path("data/raw_guidelines")


def load_pdfs():
    documents = []

    for pdf_path in RAW_GUIDELINES.glob("*.pdf"):
        pdf = fitz.open(pdf_path)

        for page_num, page in enumerate(pdf, start=1):
            text = page.get_text()

            documents.append(
                {
                    "filename": pdf_path.name,
                    "page": page_num,
                    "text": text,
                }
            )

    return documents