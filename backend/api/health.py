"""
backend/api/health.py — Full health check with DB + LLM status
"""
from fastapi import APIRouter
from config.settings import settings

router = APIRouter()


@router.get("", summary="System health check")
async def health():
    """Return system health status including DB and LLM provider."""
    db_status = "disconnected"
    try:
        from db.connection import check_db_health
        db_status = await check_db_health()
    except Exception:
        db_status = "unavailable"

    return {
        "status": "healthy",
        "api": "online",
        "database": db_status,
        "llm_provider": settings.LLM_PROVIDER,
        "version": "1.0.0",
    }