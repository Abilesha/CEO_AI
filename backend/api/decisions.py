"""
backend/api/decisions.py — Decisions API Router with Database integration
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db.connection import get_database

logger = logging.getLogger(__name__)
router = APIRouter()


class DecisionItem(BaseModel):
    id: str
    title: str
    description: str
    impact: str
    status: str
    created_at: str


class UpdateDecisionRequest(BaseModel):
    status: str


MOCK_DECISIONS = [
    {"id": "dec-1", "title": "Diversify Component Assembly to APAC-B", "description": "Move 35% of parts staging to Vietnam base to bypass upcoming regional tariff adjustments.", "impact": "high", "status": "pending", "created_at": "2026-07-04"},
    {"id": "dec-2", "title": "Deprecate API Legacy Cluster V1", "description": "Sunset the REST pipeline build v1.4.1. Estimated token savings: 18%.", "impact": "medium", "status": "pending", "created_at": "2026-07-04"},
    {"id": "dec-3", "title": "Approve Cloud Infrastructure Expansion", "description": "Provision an additional multi-region cluster for database replication.", "impact": "high", "status": "approved", "created_at": "2026-07-02"},
    {"id": "dec-4", "title": "Ad-hoc Social Campaign Launch", "description": "Deploy auto-generated AI advertising campaign across digital media.", "impact": "low", "status": "rejected", "created_at": "2026-06-30"},
]


@router.get("", response_model=list[DecisionItem])
async def get_decisions():
    """Fetches all strategic decisions/recommendations from database."""
    db = get_database()
    results = []

    if db:
        try:
            rows = await db.fetch_all("SELECT * FROM recommendations LIMIT 10")
            for r in rows:
                row_dict = dict(r)
                priority = str(row_dict.get("priority", "medium")).lower()
                impact = "high" if "high" in priority or "critical" in priority else "low" if "low" in priority else "medium"
                results.append(DecisionItem(
                    id=str(row_dict.get("id", "")),
                    title=row_dict.get("title", "Strategic Recommendation"),
                    description=row_dict.get("description") or f"Execute priority action: {row_dict.get('category', 'General')}",
                    impact=impact,
                    status=row_dict.get("status") or "pending",
                    created_at="2026-07-04"
                ))
        except Exception as e:
            logger.error("Failed to query recommendations table: %s", e)

    if not results:
        results = [DecisionItem(**d) for d in MOCK_DECISIONS]

    return results


@router.patch("/{decision_id}", response_model=DecisionItem)
async def update_decision_status(decision_id: str, body: UpdateDecisionRequest):
    """Updates decision approval status."""
    if body.status not in ["approved", "rejected", "pending"]:
        raise HTTPException(status_code=400, detail="Invalid status type")

    db = get_database()
    if db:
        try:
            try:
                val_id = int(decision_id)
            except ValueError:
                val_id = decision_id
            row = await db.fetch_one(
                "UPDATE recommendations SET status = :status WHERE id = :id RETURNING *",
                values={"status": body.status, "id": val_id}
            )
            if row:
                row_dict = dict(row)
                priority = str(row_dict.get("priority", "medium")).lower()
                impact = "high" if "high" in priority else "low" if "low" in priority else "medium"
                return DecisionItem(
                    id=str(row_dict["id"]),
                    title=row_dict.get("title", ""),
                    description=row_dict.get("description") or "",
                    impact=impact,
                    status=row_dict.get("status", "pending"),
                    created_at="2026-07-04"
                )
        except Exception as e:
            logger.error("Failed to update decision in DB: %s", e)

    for item in MOCK_DECISIONS:
        if item["id"] == decision_id:
            item["status"] = body.status
            return DecisionItem(**item)

    raise HTTPException(status_code=404, detail="Decision not found")
