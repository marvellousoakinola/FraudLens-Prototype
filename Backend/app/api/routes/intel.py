from fastapi import APIRouter, Depends
from typing import List
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/actors")
async def get_actors(current_user: User = Depends(get_current_user)):
    # Mock data for now, can be connected to DB later
    return [
        {"name": "Shadow Viper", "origin": "Eastern Europe", "risk": "Critical", "color": "red"},
        {"name": "Lazarus Group", "origin": "North Korea", "risk": "High", "color": "orange"},
        {"name": "APT28", "origin": "Russia", "risk": "High", "color": "orange"},
        {"name": "Sandworm", "origin": "Russia", "risk": "Critical", "color": "red"},
    ]
