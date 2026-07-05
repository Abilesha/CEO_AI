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
from api.leadgen import router as leadgen_router
from api.sales import router as sales_router
from api.boardroom import router as boardroom_router
from api.reports import router as reports_router
from api.decisions import router as decisions_router
from api.team import router as team_router
from api.schedule import router as schedule_router
from api.crisis import router as crisis_router

api_router = APIRouter()

api_router.include_router(health_router,           prefix="/health",          tags=["Health"])
api_router.include_router(auth_router,             prefix="/auth",            tags=["Authentication"])
api_router.include_router(chat_router,             prefix="/chat",            tags=["Chat / AI"])
api_router.include_router(dashboard_router,        prefix="/dashboard",       tags=["Dashboard"])
api_router.include_router(analytics_router,        prefix="/analytics",       tags=["Analytics"])
api_router.include_router(recommendations_router,  prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(onboarding_router,       prefix="/onboarding",      tags=["Onboarding"])
api_router.include_router(leadgen_router,          prefix="/leadgen",         tags=["Lead Generation"])
api_router.include_router(sales_router,            prefix="/sales",           tags=["Sales Funnels"])
api_router.include_router(boardroom_router,        prefix="/boardroom",       tags=["Boardroom Debate"])
api_router.include_router(reports_router,          prefix="/reports",         tags=["Reports Archive"])
api_router.include_router(decisions_router,        prefix="/decisions",       tags=["Decisions approval"])
api_router.include_router(team_router,             prefix="/team",            tags=["Team roster"])
api_router.include_router(schedule_router,         prefix="/schedule",        tags=["Scheduler routines"])
api_router.include_router(crisis_router,           prefix="/crisis",          tags=["Crisis risk detector"])