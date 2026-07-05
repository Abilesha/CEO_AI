"""
backend/api/chat.py — Multi-agent AI chat with OpenRouter LLM
"""
from __future__ import annotations

import uuid
import logging
from datetime import datetime, timezone
from typing import Optional

import httpx
from fastapi import APIRouter
from pydantic import BaseModel

from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory session store (falls back gracefully when DB unavailable)
_sessions: dict[str, list[dict]] = {}

SYSTEM_PROMPT = """You are CEO AI, an elite executive intelligence platform.
You act as a multi-agent advisory team with specialized agents:
- CEO Agent: Strategic synthesis and executive decisions
- Finance Agent: Financial analysis, forecasting, risk
- Marketing Agent: Brand, growth, campaign strategy
- Sales Agent: Pipeline, win/loss, revenue optimization
- Operations Agent: Efficiency, supply chain, processes
- Strategy Agent: Competitive intelligence, M&A, expansion
- Customer Success Agent: NPS, churn, retention

Key company metrics context:
- Revenue MTD: $4.2M | YoY Growth: +18.4% | Runway: 20 months
- Gross Margin: 64.2% | Win Rate: 72.7% | NPS: 72
- Pipeline: $12.4M | Churn: 0.93% | NRR: 118%

Respond as a world-class CEO advisor. Be concise, data-driven, and actionable.
Format responses with clear structure using bullet points and bold headers where appropriate."""


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    agent: Optional[str] = "ceo"


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    agent_reports: Optional[list[dict]] = None
    timestamp: str


async def call_openrouter(messages: list[dict]) -> str:
    """Call OpenRouter API with the conversation history."""
    if not settings.OPENROUTER_API_KEY:
        return _fallback_response(messages[-1]["content"] if messages else "")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.OPENROUTER_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://ceo-ai.dev",
                    "X-Title": "CEO AI Executive Platform",
                },
                json={
                    "model": settings.OPENROUTER_MODEL,
                    "messages": messages,
                    "max_tokens": 1024,
                    "temperature": 0.7,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error("OpenRouter call failed: %s", e)
        return _fallback_response(messages[-1]["content"] if messages else "")


def _fallback_response(user_msg: str) -> str:
    """Intelligent fallback when LLM is unavailable."""
    msg_lower = user_msg.lower()
    if any(w in msg_lower for w in ["revenue", "finance", "money", "profit", "cost"]):
        return (
            "**Finance Agent Report**\n\n"
            "📊 Current financial position is strong:\n"
            "- **Revenue MTD**: $4.2M (+18.4% YoY)\n"
            "- **Gross Margin**: 64.2% (target: 65%)\n"
            "- **Runway**: 20 months at current burn\n"
            "- **ARR**: $48M | MRR: $4M\n\n"
            "⚠️ **Action required**: $145K AR overdue — recommend immediate collections escalation."
        )
    elif any(w in msg_lower for w in ["customer", "churn", "nps", "retention"]):
        return (
            "**Customer Success Agent Report**\n\n"
            "📈 Customer health overview:\n"
            "- **NPS**: 72 (industry avg: 41)\n"
            "- **Churn Rate**: 0.93% (target: <1%)\n"
            "- **NRR**: 118% — strong expansion revenue\n"
            "- **At-risk accounts**: 23 (NPS < 50)\n\n"
            "🎯 **Recommended action**: Schedule proactive success calls for at-risk accounts this week."
        )
    elif any(w in msg_lower for w in ["sales", "pipeline", "deal", "win"]):
        return (
            "**Sales Agent Report**\n\n"
            "🚀 Sales performance:\n"
            "- **Pipeline**: $12.4M | Win Rate: 72.7%\n"
            "- **Avg Deal Size**: $48K | Sales Cycle: 47 days\n"
            "- **Quota Attainment**: 94%\n"
            "- **3 hot deals** at 85%+ close probability totaling $1.8M\n\n"
            "⚡ **Priority**: Assign AE + SE pairs to accelerate the 3 enterprise deals this sprint."
        )
    elif any(w in msg_lower for w in ["market", "brand", "campaign", "seo", "growth"]):
        return (
            "**Marketing Agent Report**\n\n"
            "📣 Marketing performance:\n"
            "- **CAC**: $1,240 | LTV: $18,600 | LTV:CAC ratio: 15:1\n"
            "- **MQL Volume**: 847/month | Conversion: 3.2%\n"
            "- **Brand Awareness**: 34% in target market\n\n"
            "💡 **Opportunity**: SEO content expansion can reduce CAC by 22% within 6 months."
        )
    else:
        return (
            "**CEO AI Executive Summary**\n\n"
            "Good question. Based on current business intelligence:\n\n"
            "**Key Priorities This Week:**\n"
            "1. 🔴 Close $1.8M in late-stage enterprise deals (Q end urgency)\n"
            "2. 🟡 Address 23 at-risk customer accounts before churn materializes\n"
            "3. 🟡 Resolve $145K overdue AR — cash flow protection\n"
            "4. 🟢 Prepare competitive defense playbook vs CompetitorAlpha\n\n"
            "**Overall Health Score: 82/100** — Strong but watch customer success metrics.\n\n"
            "What specific area would you like to deep-dive into?"
        )


@router.post("", response_model=ChatResponse, summary="Chat with CEO AI")
async def chat(body: ChatRequest):
    """Send a message and receive an AI-generated response using LangGraph."""
    session_id = body.session_id or str(uuid.uuid4())

    if session_id not in _sessions:
        _sessions[session_id] = [{"role": "system", "content": SYSTEM_PROMPT}]

    _sessions[session_id].append({"role": "user", "content": body.message})

    # Keep context window manageable
    history = [m for m in _sessions[session_id] if m["role"] != "system"]
    history = history[-20:]

    # Invoke the LangGraph workflow
    from services.langgraph_chat import run_chat_workflow
    reply = await run_chat_workflow(history)

    _sessions[session_id].append({"role": "assistant", "content": reply})

    return ChatResponse(
        reply=reply,
        session_id=session_id,
        agent_reports=None,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/sessions", summary="List chat sessions")
async def list_sessions():
    return {"sessions": list(_sessions.keys()), "total": len(_sessions)}


@router.get("/history/{session_id}", summary="Get chat history")
async def get_history(session_id: str):
    history = _sessions.get(session_id, [])
    # Filter out system prompt from returned history
    messages = [m for m in history if m["role"] != "system"]
    return {"session_id": session_id, "messages": messages, "total": len(messages)}


@router.delete("/history/{session_id}", summary="Clear chat session")
async def clear_session(session_id: str):
    _sessions.pop(session_id, None)
    return {"message": "Session cleared", "session_id": session_id}
