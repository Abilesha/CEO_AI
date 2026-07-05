"""
backend/api/analytics.py — Revenue trends, risk scores, and performance data
"""
from __future__ import annotations
from fastapi import APIRouter

router = APIRouter()


@router.get("/revenue-trend", summary="Monthly Revenue Trend")
async def revenue_trend():
    """Return 12-month revenue data for charting."""
    return {
        "labels": ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "revenue": [2800000, 3100000, 2950000, 3400000, 3600000, 3200000,
                    3800000, 3650000, 3900000, 4100000, 3950000, 4200000],
        "target":  [3000000, 3000000, 3000000, 3500000, 3500000, 3500000,
                    4000000, 4000000, 4000000, 4000000, 4000000, 4000000],
    }


@router.get("/department-risk", summary="Department Risk Scores")
async def department_risk():
    """Return risk assessment scores per department."""
    return [
        {"department": "Finance",           "risk_score": 28, "trend": "stable",   "alerts": 1},
        {"department": "Marketing",         "risk_score": 42, "trend": "improving", "alerts": 2},
        {"department": "Sales",             "risk_score": 35, "trend": "improving", "alerts": 1},
        {"department": "Operations",        "risk_score": 19, "trend": "stable",   "alerts": 0},
        {"department": "Customer Success",  "risk_score": 55, "trend": "worsening", "alerts": 3},
        {"department": "Engineering",       "risk_score": 31, "trend": "stable",   "alerts": 1},
    ]


@router.get("/performance-summary", summary="Performance Summary")
async def performance_summary():
    """Return overall performance summary metrics."""
    return {
        "overall_health_score": 82,
        "goals_on_track": 14,
        "goals_at_risk": 3,
        "goals_behind": 1,
        "executive_efficiency": "High",
        "team_alignment": "87%",
        "decision_velocity": "2.4 days avg",
    }
