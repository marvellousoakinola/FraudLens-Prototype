from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.user import User
from app.models.scan import Scan
from app.core.deps import get_current_user

router = APIRouter()

# Response Models
class UserProfile(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool = True
    created_at: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None

class UserSettings(BaseModel):
    notifications_enabled: bool = True
    email_alerts: bool = True
    dark_mode: bool = False
    language: str = "en"

class ScanActivity(BaseModel):
    scan_id: str
    timestamp: str
    risk_score: int
    risk_level: str

class UserActivityResponse(BaseModel):
    recent_scans: List[ScanActivity]
    total_scans: int
    threats_detected: int

@router.get("/me", response_model=UserProfile)
async def get_me(user: User = Depends(get_current_user)):
    """
    Get current user profile
    """
    return UserProfile(
        id=user.id,
        email=user.email,
        name=user.name or user.email.split("@")[0],
        avatar=user.avatar,
        is_active=True
    )

@router.put("/profile", response_model=UserProfile)
async def update_profile(
    data: ProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.name:
        user.name = data.name
    if data.avatar:
        user.avatar = data.avatar
    
    db.commit()
    db.refresh(user)
    
    return UserProfile(
        id=user.id,
        email=user.email,
        name=user.name,
        avatar=user.avatar,
        is_active=True
    )

@router.get("/settings", response_model=UserSettings)
async def get_user_settings(user: User = Depends(get_current_user)):
    """
    Get user preferences and settings
    """
    # In production, this would come from user.settings
    return UserSettings()

@router.put("/settings", response_model=UserSettings)
async def update_user_settings(settings: UserSettings, user: User = Depends(get_current_user)):
    """
    Update user preferences and settings
    """
    # In production, save to database
    return settings

@router.get("/activity", response_model=UserActivityResponse)
async def get_user_activity(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Get user's recent scan activity
    """
    recent_scans = (
        db.query(Scan)
        .filter(Scan.user_id == user.id)
        .order_by(Scan.timestamp.desc())
        .limit(5)
        .all()
    )
    
    total_scans = db.query(func.count(Scan.id)).filter(Scan.user_id == user.id).scalar() or 0
    threats_detected = db.query(func.count(Scan.id)).filter(
        Scan.user_id == user.id,
        Scan.risk_level == "high"
    ).scalar() or 0

    return UserActivityResponse(
        recent_scans=[
            ScanActivity(
                scan_id=scan.id,
                timestamp=scan.timestamp.isoformat(),
                risk_score=int(scan.risk_score),
                risk_level=scan.risk_level
            )
            for scan in recent_scans
        ],
        total_scans=total_scans,
        threats_detected=threats_detected
    )
