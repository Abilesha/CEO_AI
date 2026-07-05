"""
backend/api/crisis.py — AI Crisis and Risk Audit Detector Agent Router
"""
from __future__ import annotations

import json
import logging
from fastapi import APIRouter
from pydantic import BaseModel
import httpx

from config.settings import settings
from db.connection import get_database

logger = logging.getLogger(__name__)
router = APIRouter()


class RiskCategory(BaseModel):
    id: str
    name: str
    level: str
    indicatorColor: str
    badgeClass: str
    briefSummary: str
    metrics: list[str]
    reason: str
    actions: list[str]
    recovery: str


MOCK_RISKS = [
    {
        "id": "lead",
        "name": "Lead Pipeline Risk",
        "level": "High",
        "indicatorColor": "#f87171",
        "badgeClass": "danger",
        "briefSummary": "Lead generation decreased by 18% over the past 14 days.",
        "metrics": ["Website Traffic: -8%", "Ad Click-through Rate: -14%", "Form Submissions: -18%"],
        "reason": "Ad fatigue detected on display networks. The creative assets have been running for 90+ days without updates.",
        "actions": [
            "Launch WhatsApp Campaign: Re-engage top-of-funnel drops using custom template hooks.",
            "Run Retargeting Ads: Refresh ad copy focusing on compliance features.",
            "Reactivate Cold Leads: Set up an automated email discount sweep targeting leads cold for 30+ days."
        ],
        "recovery": "+11% Lead Growth (Expected recovery period: 10 days)"
    },
    {
        "id": "churn",
        "name": "Customer Churn Risk",
        "level": "Medium",
        "indicatorColor": "#fbbf24",
        "badgeClass": "warning",
        "briefSummary": "Projected loss of 37 customers due to support escalations.",
        "metrics": ["Support Tickets Volume: +22%", "Negative Feedback Reviews: +5%", "Product Usage Velocity: -4%"],
        "reason": "Onboarding bottleneck. New clients are getting stuck in the API integration phase, causing ticket volume spikes.",
        "actions": [
            "Publish Integration Guide: Email a step-by-step walkthrough detailing webhook configurations.",
            "Trigger CS Callback: Have account managers reach out to clients with tickets open for 48+ hours.",
            "Deploy Chatbot Assist: Pre-populate the Customer Success bot with API credentials guide chips."
        ],
        "recovery": "-28% Churn Reduction (Preventing loss of ~15 accounts)"
    },
    {
        "id": "revenue",
        "name": "Revenue Risk",
        "level": "Low",
        "indicatorColor": "#34d399",
        "badgeClass": "success",
        "briefSummary": "Quarterly MRR growth is stable with minor regional variance.",
        "metrics": ["Indian Segment ARR: +18%", "APAC Segment ARR: +4%", "AOV Expansion: +3%"],
        "reason": "No critical revenue leaks detected. Upsell streams are offsetting minor pipeline slippages.",
        "actions": [
            "Monitor Regional Volatility: Run weekly audits on APAC contract renewals.",
            "Expand AOV Bundles: Launch B2B value packs for SaaS accounts."
        ],
        "recovery": "Maintain stable ARR trajectory (+14% QoQ target)"
    },
    {
        "id": "cashflow",
        "name": "Cash Flow Risk",
        "level": "Low",
        "indicatorColor": "#34d399",
        "badgeClass": "success",
        "briefSummary": "Receivables collections are healthy; runway is comfortable.",
        "metrics": ["Receivables Dues: 94% on time", "Average Collections Period: 18 days", "Remaining Runway: 4.2 Months"],
        "reason": "Working capital cycles are optimal. Outflows are balanced against recurring subscription cycles.",
        "actions": [
            "Audit Runway Burn: Update forecast modeling values in Analytics Engine.",
            "Setup Early Invoicing: Automate invoice dispatches 5 days before payment cycles."
        ],
        "recovery": "Extend runway to 5.5 Months"
    }
]


@router.get("", response_model=list[RiskCategory], summary="Audit Business Risks")
async def audit_risks():
    """AI Risk Audit: Queries DB to detect critical supply/lead safety levels and flags operational alerts."""
    db = get_database()
    db_insights_summary = "Inventory stocking velocity is currently stable across all registered hardware segments."

    if db:
        try:
            rows = await db.fetch_all("SELECT component_name, stock_quantity FROM electronic_components WHERE stock_quantity < 100 LIMIT 5")
            if rows:
                names = [r["component_name"] for r in rows]
                db_insights_summary = f"Critical inventory alert: {', '.join(names)} are running below safe B2B stocking levels."
        except Exception as e:
            logger.error("DB check in risk audit failed: %s", e)

    # Update the lead risk summary with live DB context
    risks = [dict(r) for r in MOCK_RISKS]
    risks[0]["briefSummary"] = f"Lead generation decreased by 18% over past 14 days. {db_insights_summary}"

    return [RiskCategory(**r) for r in risks]
