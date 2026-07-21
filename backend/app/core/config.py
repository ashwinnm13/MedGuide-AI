from __future__ import annotations

import logging
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ollama_base_url: str | None = None
    model_name: str = "nomic-embed-text"
    embed_model: str = "nomic-embed-text"
    openrouter_api_key: str | None = None
    openrouter_base_url: str | None = "https://openrouter.ai/api/v1"
    openrouter_model: str | None = None
    tavily_api_key: str | None = None
    chroma_path: str = str(Path(__file__).resolve().parents[2] / "data" / "chroma_db")
    chunk_size: int = 1000
    chunk_overlap: int = 200
    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()


def configure_logging() -> None:
    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
    logging.getLogger("chromadb").setLevel(logging.WARNING)
    logging.getLogger("langchain").setLevel(logging.WARNING)


__all__ = ["settings", "configure_logging"]
