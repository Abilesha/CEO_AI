"""
backend/db/connection.py — Async PostgreSQL connection via databases + asyncpg
"""
from __future__ import annotations

import logging
from typing import Optional

logger = logging.getLogger(__name__)

_db = None


def get_database():
    return _db


async def connect_db():
    global _db
    try:
        from databases import Database
        from config.settings import settings

        if not settings.DATABASE_URL:
            logger.warning("DATABASE_URL not configured — skipping DB connection.")
            return

        _db = Database(settings.DATABASE_URL)
        await _db.connect()
        logger.info("✅ Connected to PostgreSQL (Supabase)")
    except Exception as exc:
        logger.error("❌ DB connection failed: %s", exc)
        _db = None


async def disconnect_db():
    global _db
    if _db:
        try:
            await _db.disconnect()
            logger.info("DB disconnected.")
        except Exception:
            pass
        _db = None


async def check_db_health() -> str:
    if _db is None:
        return "disconnected"
    try:
        await _db.fetch_one("SELECT 1")
        return "connected"
    except Exception:
        return "error"
