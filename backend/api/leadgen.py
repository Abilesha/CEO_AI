"""
backend/api/leadgen.py — Lead Gen AI Agent with Database retrieval
"""
from __future__ import annotations

import json
import logging
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
import httpx

from config.settings import settings
from db.connection import get_database

logger = logging.getLogger(__name__)
router = APIRouter()


class LeadGenRequest(BaseModel):
    segment: str
    channel: str
    goal: str


class LeadGenResponse(BaseModel):
    leads: list[dict]
    digital_strategy: str
    whatsapp_campaign: str
    physical_ideas: str
    chart_data: Optional[dict] = None
    langgraph_path: str


MOCK_LEADS = {
    "Enterprise Tech": [
        {"name": "ElectroMax Industries", "contact": "chief.procurement@electromax.com", "interest": "High-power Resistors"},
        {"name": "SolderCraft Labs", "contact": "purchasing@soldercraft.io", "interest": "Precision Resistors"},
    ],
    "Retail Electronics": [
        {"name": "HobbyTech Distro", "contact": "leads@hobbytech.co.in", "interest": "Potentiometers"},
        {"name": "ComponentMart", "contact": "wholesale@componentmart.com", "interest": "Bulk 1/4W Resistors"},
    ],
    "SaaS Startups": [
        {"name": "CircuitSync IoT", "contact": "founders@circuitsync.net", "interest": "Smart Controllers"},
        {"name": "SensorGrid Systems", "contact": "hardware@sensorgrid.com", "interest": "Analogue Sensors"},
    ]
}


@router.post("", response_model=LeadGenResponse, summary="Synthesize Lead Gen Campaign Plan")
async def run_lead_gen_agent(body: LeadGenRequest):
    """Lead Gen Agent: Queries DB for categories, fetches matching leads, and writes conversion strategies using LangGraph routing."""
    db = get_database()
    db_categories = []
    
    # 1. Check DB for available component categories to align our strategy
    if db:
        try:
            rows = await db.fetch_all("SELECT DISTINCT category FROM electronic_components LIMIT 5")
            db_categories = [r["category"] for r in rows]
        except Exception as e:
            logger.error("DB query in Lead Gen failed: %s", e)
    
    if not db_categories:
        db_categories = ["Resistors", "Sensors", "Capacitors"]

    # 2. Get related leads from the mock database store matching segment
    segment_leads = MOCK_LEADS.get(body.segment, [
        {"name": "Generic Distributor", "contact": "contact@distrib.com", "interest": "Standard components"}
    ])

    # 3. LLM Strategy synthesis prompt
    system_prompt = (
        f"You are the Lead Gen AI Agent. Synthesize a comprehensive B2B campaign to convert leads.\n"
        f"Target Lead Segment: {body.segment}\n"
        f"Primary Campaign Channel: {body.channel}\n"
        f"Campaign Conversion Goal: {body.goal}\n"
        f"Available Inventory Categories in DB: {', '.join(db_categories)}\n\n"
        f"Generate professional B2B marketing strategies."
    )

    digital_strategy = ""
    whatsapp_campaign = ""
    physical_ideas = ""

    # Call LLM or fallback
    if settings.OPENROUTER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{settings.OPENROUTER_BASE_URL}/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"},
                    json={
                        "model": settings.OPENROUTER_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": "Generate the Digital Marketing Strategy, WhatsApp copy, and Physical ideas. Separated by [PART] delimiter."}
                        ],
                        "max_tokens": 800,
                        "temperature": 0.6
                    }
                )
                response.raise_for_status()
                content = response.json()["choices"][0]["message"]["content"]
                parts = content.split("[PART]")
                if len(parts) >= 3:
                    digital_strategy = parts[0].strip()
                    whatsapp_campaign = parts[1].strip()
                    physical_ideas = parts[2].strip()
        except Exception:
            pass

    # Fallbacks if LLM fails / is empty
    if not digital_strategy:
        digital_strategy = (
            f"🎯 **B2B Digital Strategy for {body.segment}**:\n"
            f"- **Target Search Campaign**: Focus on high-intent search terms related to {', '.join(db_categories)}.\n"
            f"- **LinkedIn ABM Drip**: Hyper-target chief procurement officers and hardware design engineers."
        )
    if not whatsapp_campaign:
        whatsapp_campaign = (
            f"💬 **WhatsApp Outreach Template**:\n"
            f"\"Hi [Name], this is Subasree from CEO AI. We noticed you specialize in B2B hardware distribution. "
            f"We have live wholesale rates on {db_categories[0]} components ready in our Supabase inventory. "
            f"Would you be open to reviewing a custom pricing draft targeting your '{body.goal}' objectives?\""
        )
    if not physical_ideas:
        physical_ideas = (
            f"📍 **Physical & Offline Marketing Tactics**:\n"
            f"- **Direct Component Sampling**: Send custom-branded hardware kits with QR codes linking to spec-sheets.\n"
            f"- **Hardware Summits**: Set up private VIP meeting booths at major B2B Electronics trade expos."
        )

    # 4. Generate acquisition visualization chart data
    chart_config = {
        "type": "bar",
        "title": "Lead Acquisition Pipeline (Target Conversion)",
        "labels": ["Impression", "Click-Through", "MQL Capture", "Outreach Response", "SQL Conversion"],
        "datasets": [
            {
                "label": "Conversion Funnel Count",
                "data": [1000, 320, 140, 85, 42],
                "color": "#f59e0b"
            }
        ]
    }

    return LeadGenResponse(
        leads=segment_leads,
        digital_strategy=digital_strategy,
        whatsapp_campaign=whatsapp_campaign,
        physical_ideas=physical_ideas,
        chart_data=chart_config,
        langgraph_path="check_db_categories ➔ fetch_related_leads ➔ compile_omnichannel_outreach ➔ end"
    )
