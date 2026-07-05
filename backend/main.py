"""
CEO AI — FastAPI Application
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from api import api_router
from config.settings import settings
from db.connection import connect_db, disconnect_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("ceo_ai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 CEO AI Backend starting up…")
    logger.info("   LLM Provider : %s", settings.LLM_PROVIDER)
    logger.info("   API Prefix   : /api/v1")
    logger.info("   Docs         : http://localhost:8000/docs")
    if settings.DATABASE_URL:
        await connect_db()
    else:
        logger.warning("DATABASE_URL not set — running without persistent DB.")
    yield
    if settings.DATABASE_URL:
        await disconnect_db()
    logger.info("👋 CEO AI Backend shut down.")


app = FastAPI(
    title="CEO AI – Executive Intelligence Platform",
    description=(
        "Multi-agent AI system powered by Google Gemini and OpenRouter. "
        "CEO Agent orchestrates specialized department agents with persistent "
        "chat history backed by PostgreSQL (Supabase)."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://ceo-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route — redirect to docs
@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

# All API routes
app.include_router(api_router, prefix="/api/v1")