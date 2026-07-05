"""
backend/api/team.py — Team Management API Router with Database integration
"""
from __future__ import annotations

import logging
from fastapi import APIRouter
from pydantic import BaseModel

from db.connection import get_database

logger = logging.getLogger(__name__)
router = APIRouter()


class TeamMember(BaseModel):
    id: str
    name: str
    email: str
    role: str
    status: str


class InviteMemberRequest(BaseModel):
    name: str
    email: str
    role: str


MOCK_MEMBERS = [
    {"id": "1", "name": "Subhasri (Admin)", "email": "subasree8606@gmail.com", "role": "admin", "status": "active"},
    {"id": "2", "name": "Alexander Sterling", "email": "alex@ceo.ai", "role": "executive", "status": "active"},
    {"id": "3", "name": "Sarah Vance", "email": "sarah@ceo.ai", "role": "executive", "status": "offline"},
    {"id": "4", "name": "Michael Coyle", "email": "michael@ceo.ai", "role": "viewer", "status": "offline"},
]


@router.get("", response_model=list[TeamMember])
async def get_team_members():
    db = get_database()
    results = []

    if db:
        try:
            rows = await db.fetch_all("SELECT * FROM users LIMIT 20")
            for r in rows:
                row_dict = dict(r)
                results.append(TeamMember(
                    id=str(row_dict.get("id", "")),
                    name=row_dict.get("full_name") or row_dict.get("email", "").split("@")[0].capitalize(),
                    email=row_dict.get("email", ""),
                    role=row_dict.get("role") or "viewer",
                    status="active"
                ))
        except Exception as e:
            logger.error("Failed to query users table: %s", e)

    if not results:
        results = [TeamMember(**m) for m in MOCK_MEMBERS]

    return results


@router.post("", response_model=TeamMember)
async def invite_team_member(body: InviteMemberRequest):
    db = get_database()
    new_member = TeamMember(
        id=body.email.replace("@", "_").replace(".", "_"),
        name=body.name,
        email=body.email,
        role=body.role,
        status="offline"
    )

    if db:
        try:
            row = await db.fetch_one(
                "INSERT INTO users (email, full_name, role) VALUES (:email, :full_name, :role) RETURNING *",
                values={"email": body.email, "full_name": body.name, "role": body.role}
            )
            if row:
                row_dict = dict(row)
                return TeamMember(
                    id=str(row_dict.get("id")),
                    name=row_dict.get("full_name") or "",
                    email=row_dict.get("email") or "",
                    role=row_dict.get("role") or "viewer",
                    status="active"
                )
        except Exception as e:
            logger.error("Failed to insert user into DB: %s", e)

    MOCK_MEMBERS.append(new_member.dict())
    return new_member
