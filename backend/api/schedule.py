"""
backend/api/schedule.py — Schedule and Automation API Router
"""
from __future__ import annotations

import os
import json
import logging
import time as _time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

SCHEDULE_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "schedule.json")
os.makedirs(os.path.dirname(SCHEDULE_FILE), exist_ok=True)


class ScheduleJob(BaseModel):
    id: int
    task: str
    icon: str
    time: str
    freq: str
    channel: str
    status: str


class LogEntry(BaseModel):
    timestamp: str
    engine: str
    message: str
    type: str


class ScheduleResponse(BaseModel):
    jobs: list[ScheduleJob]
    logs: list[LogEntry]


class CreateJobRequest(BaseModel):
    task: str
    icon: str
    time: str
    freq: str
    channel: str


DEFAULT_DATA = {
    "jobs": [
        {"id": 1, "task": "Run Market Research", "icon": "🧭", "time": "09:30 AM", "freq": "Daily", "channel": "Dashboard", "status": "active"},
        {"id": 2, "task": "Model Marketing Spend", "icon": "📣", "time": "11:00 AM", "freq": "Weekly", "channel": "Email", "status": "active"},
        {"id": 3, "task": "Run Lead Gen Outbound Drip", "icon": "⚡", "time": "03:00 PM", "freq": "Daily", "channel": "WhatsApp", "status": "active"},
    ],
    "logs": [
        {"timestamp": "09:30:02 AM", "engine": "Strategy Engine", "message": "Autonomous market scan completed. Updated positioning model for B2B SaaS.", "type": "success"},
        {"timestamp": "09:30:15 AM", "engine": "Strategy Engine", "message": "Report compiled and sent to executive briefing feed.", "type": "info"},
        {"timestamp": "11:00:01 AM", "engine": "Marketing Engine", "message": "Marketing campaign run initiated for regional segment.", "type": "info"},
        {"timestamp": "11:00:24 AM", "engine": "Marketing Engine", "message": "Budget allocation updated: +12% focus on Instagram Reels.", "type": "success"},
        {"timestamp": "03:00:02 PM", "engine": "Lead Gen Engine", "message": "WhatsApp campaign drip triggered: 14 outbound triggers dispatched.", "type": "success"},
        {"timestamp": "03:00:10 PM", "engine": "Lead Gen Engine", "message": "Interakt API returned 100% dispatch delivery confirmation.", "type": "info"},
    ]
}


def load_schedule_data() -> ScheduleResponse:
    if not os.path.exists(SCHEDULE_FILE):
        with open(SCHEDULE_FILE, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_DATA, f, indent=2)
        return ScheduleResponse(**DEFAULT_DATA)
    try:
        with open(SCHEDULE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return ScheduleResponse(**data)
    except Exception:
        return ScheduleResponse(**DEFAULT_DATA)


def save_schedule_data(payload: ScheduleResponse):
    try:
        with open(SCHEDULE_FILE, "w", encoding="utf-8") as f:
            json.dump(payload.dict(), f, indent=2)
    except Exception as e:
        logger.error("Failed to save schedule file: %s", e)


@router.get("", response_model=ScheduleResponse)
async def get_schedule_and_logs():
    return load_schedule_data()


@router.post("", response_model=ScheduleJob)
async def create_schedule_job(body: CreateJobRequest):
    data = load_schedule_data()
    new_job = ScheduleJob(
        id=int(_time.time()),
        task=body.task,
        icon=body.icon,
        time=body.time,
        freq=body.freq,
        channel=body.channel,
        status="active"
    )
    data.jobs.append(new_job)
    save_schedule_data(data)
    return new_job


@router.delete("/{job_id}")
async def delete_schedule_job(job_id: int):
    data = load_schedule_data()
    updated = [j for j in data.jobs if j.id != job_id]
    if len(updated) == len(data.jobs):
        raise HTTPException(status_code=404, detail="Job not found")
    data.jobs = updated
    save_schedule_data(data)
    return {"detail": "Job deleted"}


@router.patch("/{job_id}/toggle", response_model=ScheduleJob)
async def toggle_job_status(job_id: int):
    data = load_schedule_data()
    matched = None
    for j in data.jobs:
        if j.id == job_id:
            j.status = "paused" if j.status == "active" else "active"
            matched = j
            break
    if not matched:
        raise HTTPException(status_code=404, detail="Job not found")
    save_schedule_data(data)
    return matched
