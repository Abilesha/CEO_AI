"""
backend/api/boardroom.py — AI Boardroom Agent Router
"""
from __future__ import annotations

import json
import logging
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
import httpx

from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()


class BoardroomRequest(BaseModel):
    query: str


class DebateTurn(BaseModel):
    role: str
    name: str
    avatar: str
    text: str
    color: str


class ConsensusDetails(BaseModel):
    title: str
    steps: list[str]
    expected_impact: str
    confidence_score: str


class BoardroomResponse(BaseModel):
    turns: list[DebateTurn]
    consensus: ConsensusDetails


@router.post("", response_model=BoardroomResponse, summary="Run Boardroom Debate Agent")
async def run_boardroom_debate(body: BoardroomRequest):
    """Convenes the AI Boardroom to debate the business query and compile a consensus recommendation."""
    system_prompt = (
        "You are the Boardroom Coordinator Agent. Orchestrate a debate between 4 department heads:\n"
        "1. Marketing (Ananya) - advocates for brand visibility, campaigns, social channels\n"
        "2. Finance (Vikram) - advocates for cost cutting, ROI, caution, margins\n"
        "3. Sales (Rahul) - advocates for deals, bundle offers, conversion optimization, AOV\n"
        "4. Customer Success (Priyanka) - advocates for retention, reducing churn, upsells, referrals\n\n"
        f"The CEO's Query is: \"{body.query}\"\n\n"
        "Create 4 debate turns, one for each agent, expressing their conflicting viewpoints on the query.\n"
        "Then synthesize a consensus resolution plan. Keep the tone executive, focused, and professional.\n"
        "Format the output strictly as a JSON string matching this structure:\n"
        "{\n"
        "  \"turns\": [\n"
        "    {\"role\": \"Marketing Agent\", \"name\": \"Ananya (Marketing Exec)\", \"avatar\": \"📢\", \"text\": \"...\", \"color\": \"#ec4899\"},\n"
        "    {\"role\": \"Finance Agent\", \"name\": \"Vikram (Chief Financial Officer)\", \"avatar\": \"💸\", \"text\": \"...\", \"color\": \"#f59e0b\"},\n"
        "    {\"role\": \"Sales Agent\", \"name\": \"Rahul (Sales Director)\", \"avatar\": \"💰\", \"text\": \"...\", \"color\": \"#10b981\"},\n"
        "    {\"role\": \"Customer Success Agent\", \"name\": \"Priyanka (CS Lead)\", \"avatar\": \"🤝\", \"text\": \"...\", \"color\": \"#fb923c\"}\n"
        "  ],\n"
        "  \"consensus\": {\n"
        "    \"title\": \"Consensus Strategy: ...\",\n"
        "    \"steps\": [\"Step 1...\", \"Step 2...\", \"Step 3...\"],\n"
        "    \"expected_impact\": \"Revenue +X%\",\n"
        "    \"confidence_score\": \"X%\"\n"
        "  }\n"
        "}"
    )

    result_json = None
    if settings.OPENROUTER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(
                    f"{settings.OPENROUTER_BASE_URL}/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"},
                    json={
                        "model": settings.OPENROUTER_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": "Generate the boardroom debate JSON payload. Output only valid JSON."}
                        ],
                        "max_tokens": 1200,
                        "temperature": 0.6,
                        "response_format": {"type": "json_object"}
                    }
                )
                response.raise_for_status()
                result_json = json.loads(response.json()["choices"][0]["message"]["content"])
        except Exception as e:
            logger.error("Failed to call AI Boardroom Agent: %s", e)

    # Fallback if LLM call fails
    if not result_json:
        result_json = {
            "turns": [
                {
                    "role": "Marketing Agent",
                    "name": "Ananya (Marketing Exec)",
                    "avatar": "📢",
                    "text": f"To address '{body.query}', we should launch high-impact digital campaigns and double our meta-target spend in Tier 1 cities to capture high-intent B2B leads.",
                    "color": "#ec4899"
                },
                {
                    "role": "Finance Agent",
                    "name": "Vikram (Chief Financial Officer)",
                    "avatar": "💸",
                    "text": "Any incremental marketing spend must be strictly tied to measurable conversion ratios. Let's optimize current acquisition costs before launching fresh campaigns.",
                    "color": "#f59e0b"
                },
                {
                    "role": "Sales Agent",
                    "name": "Rahul (Sales Director)",
                    "avatar": "💰",
                    "text": "Instead of burning budget on ads, let's offer higher-value bundles of our electronics inventory to increase Average Order Value (AOV) directly.",
                    "color": "#10b981"
                },
                {
                    "role": "Customer Success Agent",
                    "name": "Priyanka (CS Lead)",
                    "avatar": "🤝",
                    "text": "Our existing customer accounts hold untapped potential. Let's focus on structured upgrades and loyalty campaigns to boost MRR without acquiring new clients.",
                    "color": "#fb923c"
                }
            ],
            "consensus": {
                "title": "Synthesized Action Strategy Plan",
                "steps": [
                    "Perform low-risk digital pilot targeting warm accounts first.",
                    "Roll out Sales bundle kits to raise Average Order Value (AOV).",
                    "Establish a hard 10% ceiling on additional operational costs."
                ],
                "expected_impact": "Revenue +12%",
                "confidence_score": "85%"
            }
        }

    return BoardroomResponse(**result_json)
