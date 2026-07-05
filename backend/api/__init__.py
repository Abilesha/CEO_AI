"""
API Router — registers all endpoint groups under /api/v1
"""

from fastapi import APIRouter

from api.health import router as health_router
from api.auth import router as auth_router
from api.chat import router as chat_router
from api.dashboard import router as dashboard_router
from api.analytics import router as analytics_router
from api.recommendations import router as recommendations_router
from api.onboarding import router as onboarding_router

api_router = APIRouter()

api_router.include_router(health_router,           prefix="/health",          tags=["Health"])
api_router.include_router(auth_router,             prefix="/auth",            tags=["Authentication"])
api_router.include_router(chat_router,             prefix="/chat",            tags=["Chat / AI"])
api_router.include_router(dashboard_router,        prefix="/dashboard",       tags=["Dashboard"])
api_router.include_router(analytics_router,        prefix="/analytics",       tags=["Analytics"])
api_router.include_router(recommendations_router,  prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(onboarding_router,       prefix="/onboarding",      tags=["Onboarding"])