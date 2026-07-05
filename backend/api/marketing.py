"""
backend/api/marketing.py — AI Marketing & Instagram Post Generator Agent Router
"""
from __future__ import annotations

import json
import logging
from fastapi import APIRouter
from pydantic import BaseModel
import httpx

from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()


class GeneratePostRequest(BaseModel):
    prompt: str


class GeneratedPost(BaseModel):
    emoji: str
    theme: str
    caption: str
    hashtags: str
    cta: str


@router.post("/generate-post", response_model=GeneratedPost, summary="Generate Custom Instagram Post")
async def generate_insta_post(body: GeneratePostRequest):
    """AI Marketing Agent: Generates highly engaging Instagram copy with caption, hashtags, and CTA using OpenRouter."""
    system_prompt = (
        "You are the AI Marketing Copywriter Agent.\n"
        "Generate a highly engaging Instagram post based on the user's prompt.\n"
        "Your response must include:\n"
        "1. A relevant single emoji for the post thumbnail\n"
        "2. A short catchy theme (e.g. 'Product Launch', 'Special Offer', 'Growth Story')\n"
        "3. A compelling caption with line breaks and relevant emojis\n"
        "4. A string of 8-10 popular business/tech hashtags\n"
        "5. A direct, clear Call to Action (CTA) (e.g. 'Link in bio → ...')\n\n"
        "Format the output strictly as a JSON object matching this structure:\n"
        "{\n"
        "  \"emoji\": \"...\",\n"
        "  \"theme\": \"...\",\n"
        "  \"caption\": \"...\",\n"
        "  \"hashtags\": \"...\",\n"
        "  \"cta\": \"...\"\n"
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
                            {"role": "user", "content": f"Generate post for: {body.prompt}"}
                        ],
                        "max_tokens": 800,
                        "temperature": 0.7,
                        "response_format": {"type": "json_object"}
                    }
                )
                response.raise_for_status()
                result_json = json.loads(response.json()["choices"][0]["message"]["content"])
        except Exception as e:
            logger.error("Failed to generate Instagram post via OpenRouter: %s", e)

    # Fallback to smart rule-based copy if LLM is unavailable
    if not result_json:
        p = body.prompt.lower()
        emoji = '✨'
        theme = 'Business Growth'
        caption = f"The future of business is AI-driven. 🚀\n\nWe're scaling our operations, optimizing campaigns, and making data-backed decisions using CEO AI.\n\n📊 Real-time dashboards\n⚡ Automated workflows\n🎯 Multi-agent synthesis\n\n{body.prompt}"
        hashtags = '#CEOAI #ArtificialIntelligence #StartupIndia #BusinessGrowth #AIForBusiness #Entrepreneur #GrowthHacking'
        cta = 'Link in bio → Try CEO AI free for 14 days'

        if any(w in p for w in ['offer', 'discount', 'free', 'deal']):
            emoji = '🎁'
            theme = 'Special Promotion'
            caption = f"Big announcement! 🎉\n\nWe are running a limited-time exclusive offer: {body.prompt}.\n\n⚡ Act fast — spots are limited!\n✅ Elevate your business execution today."
            hashtags = '#SpecialOffer #LimitedTime #StartupIndia #BusinessTools #CEOAI #GrowthHacking'
            cta = 'Claim your offer → Link in bio 🎁'
        elif any(w in p for w in ['crisis', 'risk', 'problem']):
            emoji = '🛡️'
            theme = 'Risk & Safety Audit'
            caption = f"Is your business prepared for supply chain disruptions or pipeline drops?\n\nOur AI Crisis Detector runs 24/7 audits to isolate risks early. {body.prompt}"
            hashtags = '#RiskManagement #BusinessContinuity #StartupIndia #CEOAI #CrisisManagement'
            cta = 'See how CEO AI protects your business → Link in bio'

        result_json = {
            "emoji": emoji,
            "theme": theme,
            "caption": caption,
            "hashtags": hashtags,
            "cta": cta
        }

    return GeneratedPost(**result_json)
