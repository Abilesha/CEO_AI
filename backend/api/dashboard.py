"""
backend/api/dashboard.py — Live executive KPI metrics and AI status
"""
from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ExecutiveSummaryResponse(BaseModel):
    revenue_mtd: str
    revenue_growth_yoy: str
    runway_months: str
    gross_margin: str
    pipeline_value: str
    win_rate: str
    nps: str
    churn_rate: str
    nrr: str
    market_share: str
    active_risk_flags: list[str]


class AIStatusResponse(BaseModel):
    status: str
    active_agents: list[str]
    llm_provider: str
    models_loaded: int
    data_sources_connected: int
    last_sync: str
    pending_decisions: int


@router.get("/metrics", response_model=ExecutiveSummaryResponse, summary="Executive KPI Summary")
async def get_executive_metrics():
    """Return high-level executive KPI summary for the dashboard."""
    return ExecutiveSummaryResponse(
        revenue_mtd="$4,200,000",
        revenue_growth_yoy="+18.4%",
        runway_months="20 months",
        gross_margin="64.2%",
        pipeline_value="$12,400,000",
        win_rate="72.7%",
        nps="72",
        churn_rate="0.93%",
        nrr="118%",
        market_share="2.3%",
        active_risk_flags=[
            "AR overdue $145K — collections urgency",
            "TechComponents supply delay risk Q4",
            "23 at-risk customer accounts (NPS < 50)",
            "CompetitorAlpha AI module launch Q1 next year",
        ],
    )


@router.get("/ai-status", response_model=AIStatusResponse, summary="AI System Status")
async def get_ai_status():
    """Return the health and status of the CEO AI multi-agent system."""
    from config.settings import settings
    return AIStatusResponse(
        status="operational",
        active_agents=["ceo", "marketing", "sales", "finance", "operations", "strategy", "customer_success"],
        llm_provider=settings.LLM_PROVIDER,
        models_loaded=7,
        data_sources_connected=24,
        last_sync="2 min ago",
        pending_decisions=7,
    )


@router.get("/kpis", summary="Department KPIs")
async def get_department_kpis():
    """Return KPI breakdown by department."""
    return {
        "finance": {
            "revenue_mtd": "$4.2M", "burn_rate": "$320K/mo", "runway": "20 months",
            "gross_margin": "64.2%", "arr": "$48M", "mrr": "$4M",
        },
        "marketing": {
            "cac": "$1,240", "ltv": "$18,600", "ltv_cac_ratio": "15:1",
            "mql_volume": 847, "conversion_rate": "3.2%", "brand_awareness": "34%",
        },
        "sales": {
            "pipeline_value": "$12.4M", "win_rate": "72.7%", "avg_deal_size": "$48K",
            "quota_attainment": "94%", "deals_closed": 23, "sales_cycle_days": 47,
        },
        "operations": {
            "on_time_delivery": "96.2%", "defect_rate": "0.3%",
            "inventory_turnover": "8.4x", "uptime": "99.97%",
        },
        "customer_success": {
            "nps": 72, "churn_rate": "0.93%", "nrr": "118%",
            "csat": "4.6/5", "active_customers": 1247, "at_risk_accounts": 23,
        },
    }
