"""
backend/api/reports.py — Reports API endpoint with local JSON persistence
"""
from __future__ import annotations

import os
import json
import logging
from datetime import date
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

REPORTS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "reports.json")
os.makedirs(os.path.dirname(REPORTS_FILE), exist_ok=True)


class Report(BaseModel):
    id: str
    name: str
    date: str
    size: str
    type: str
    status: str


class GenerateReportRequest(BaseModel):
    name: str


def load_reports() -> list[Report]:
    if not os.path.exists(REPORTS_FILE):
        defaults = [
            {"id": "1", "name": "Q2 Executive Summary & Growth Forecast", "date": "2026-07-02", "size": "2.4 MB", "type": "PDF", "status": "generated"},
            {"id": "2", "name": "APAC Market Logistics Disruption Report", "date": "2026-07-04", "size": "1.8 MB", "type": "PDF", "status": "generated"},
            {"id": "3", "name": "Global Token Cost Optimizer Audit", "date": "2026-07-04", "size": "--", "type": "PDF", "status": "processing"},
            {"id": "4", "name": "Q1 HR Sprint Velocity Analytics", "date": "2026-04-12", "size": "4.1 MB", "type": "CSV", "status": "generated"},
            {"id": "5", "name": "Competitor Multi-agent Swarm Analysis", "date": "2026-06-28", "size": "--", "type": "PDF", "status": "failed"},
        ]
        with open(REPORTS_FILE, "w", encoding="utf-8") as f:
            json.dump(defaults, f)
        return [Report(**d) for d in defaults]
    try:
        with open(REPORTS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [Report(**item) for item in data]
    except Exception:
        return []


def save_reports(reports: list[Report]):
    try:
        with open(REPORTS_FILE, "w", encoding="utf-8") as f:
            json.dump([r.dict() for r in reports], f, indent=2)
    except Exception as e:
        logger.error("Failed to save reports file: %s", e)


@router.get("", response_model=list[Report])
async def get_all_reports():
    return load_reports()


@router.post("", response_model=Report)
async def generate_new_report(body: GenerateReportRequest):
    reports = load_reports()
    new_report = Report(
        id=str(len(reports) + 1),
        name=body.name,
        date=date.today().isoformat(),
        size="1.5 MB",
        type="PDF",
        status="generated"
    )
    reports.insert(0, new_report)
    save_reports(reports)
    return new_report


@router.delete("/{report_id}")
async def delete_archived_report(report_id: str):
    reports = load_reports()
    updated = [r for r in reports if r.id != report_id]
    if len(updated) == len(reports):
        raise HTTPException(status_code=404, detail="Report not found")
    save_reports(updated)
    return {"detail": "Report deleted successfully"}
