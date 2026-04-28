from fastapi import APIRouter, Depends
from typing import List
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("")
async def get_reports(current_user: User = Depends(get_current_user)):
    return [
        {"id": "rep-1", "target": "Authentication Module", "confidence": "98%", "status": "Fixed"},
        {"id": "rep-2", "target": "Payment Gateway", "confidence": "85%", "status": "Investigating"},
        {"id": "rep-3", "target": "User Profile API", "confidence": "92%", "status": "Open"},
    ]

@router.get("/recent")
async def get_recent_reports(current_user: User = Depends(get_current_user)):
    return [
        {"title": "Q1 Security Audit", "date": "2024-03-15", "size": "2.4 MB"},
        {"title": "Network Penetration Test", "date": "2024-02-28", "size": "1.8 MB"},
        {"title": "Compliance Checkup", "date": "2024-02-10", "size": "3.1 MB"},
    ]
