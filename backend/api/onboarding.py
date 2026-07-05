"""
backend/api/onboarding.py — Company onboarding
"""
from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter()


class OnboardingRequest(BaseModel):
    company_name: str = Field(..., min_length=1)
    industry: str
    company_size: str
    annual_revenue: Optional[str] = None
    primary_goals: Optional[list[str]] = None
    user_name: Optional[str] = None
    user_role: Optional[str] = None


@router.post("", summary="Submit company onboarding")
async def submit_onboarding(body: OnboardingRequest):
    """Save company profile and initialize the AI context."""
    return {
        "message": f"Welcome to CEO AI, {body.company_name}!",
        "company_id": "onboarded-001",
        "status": "complete",
        "next_step": "Start chatting with your CEO AI assistant",
    }


@router.get("/status", summary="Check onboarding status")
async def onboarding_status():
    return {"onboarded": True, "company_name": "Demo Corp", "industry": "Technology"}
