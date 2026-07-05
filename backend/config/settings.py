"""
backend/config/settings.py
----------------------------
Application configuration — loaded from .env
"""

from __future__ import annotations
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # --- Supabase ---
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # --- Auth ---
    JWT_SECRET: str = "ceo-ai-local-dev-secret"

    # --- PostgreSQL (databases library) ---
    DATABASE_URL: str = ""

    # --- LLM ---
    LLM_PROVIDER: str = "openrouter"         # "gemini" or "openrouter"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openai/gpt-oss-120b"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()