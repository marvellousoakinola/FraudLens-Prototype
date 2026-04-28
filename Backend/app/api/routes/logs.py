from fastapi import APIRouter, Depends
from typing import List
from app.core.deps import get_current_user
from app.models.user import User
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/live")
async def get_live_logs(current_user: User = Depends(get_current_user)):
    # Mock live logs
    now = datetime.now()
    return [
        {
            "id": "1",
            "type": "inbound",
            "severity": "high",
            "source": "192.168.1.105",
            "action": "SQL Injection Attempt",
            "target": "/api/auth/login",
            "timestamp": (now - timedelta(minutes=2)).isoformat()
        },
        {
            "id": "2",
            "type": "system",
            "severity": "low",
            "source": "Internal",
            "action": "Database Backup",
            "target": "S3 Bucket",
            "timestamp": (now - timedelta(minutes=5)).isoformat()
        },
        {
            "id": "3",
            "type": "outbound",
            "severity": "medium",
            "source": "10.0.0.45",
            "action": "Unusual Data Transfer",
            "target": "external-site.com",
            "timestamp": (now - timedelta(minutes=10)).isoformat()
        }
    ]
