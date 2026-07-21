from __future__ import annotations

from typing import TypedDict


class GraphState(TypedDict, total=False):
    query: str
    route: str
    retrieved_chunks: list[dict]
    web_results: list[dict]
    generated_answer: str
    answer: str
    sources: list[dict]
    verification: dict
    error: str
