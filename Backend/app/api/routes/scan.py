from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.services.scan import analyze_payload
from app.db.deps import get_db
from app.models.scan import Scan
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter()

# Request Models
class ScanRequest(BaseModel):
    data: str
    scan_type: Optional[str] = "fraud_detection"

# Response Models
class ScanResponse(BaseModel):
    scan_id: str
    risk_score: int
    risk_level: str
    explanation: str
    timestamp: str
    scan_type: str


@router.post("/", response_model=ScanResponse)
async def create_scan(
    request: ScanRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Analyze payload for fraud risk using AI engine and save to database
    """
    if not request.data or len(request.data.strip()) == 0:
        raise HTTPException(status_code=400, detail="Payload data cannot be empty")
    
    # Call AI analysis
    result = await analyze_payload(request.data)
    
    # Create scan record
    scan = Scan(
        id=str(uuid.uuid4()),
        data=request.data,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        explanation=", ".join(result["explanation"]),
        user_id=user.id
    )
    
    # Save to database
    db.add(scan)
    db.commit()
    db.refresh(scan)
    
    # Generate response
    return ScanResponse(
        scan_id=scan.id,
        risk_score=int(scan.risk_score),
        risk_level=scan.risk_level,
        explanation=scan.explanation,
        timestamp=scan.timestamp.isoformat(),
        scan_type=request.scan_type
    )


@router.get("/history")
async def get_scan_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    scans = (
        db.query(Scan)
        .filter(Scan.user_id == user.id)
        .order_by(Scan.timestamp.desc())
        .all()
    )

    return [
        {
            "scan_id": scan.id,
            "data": scan.data,
            "risk_score": scan.risk_score,
            "risk_level": scan.risk_level,
            "explanation": scan.explanation,
            "timestamp": scan.timestamp.isoformat()
        }
        for scan in scans
    ]


@router.get("/{scan_id}", response_model=ScanResponse)
async def get_scan(
    scan_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Get a specific scan result
    """
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return ScanResponse(
        scan_id=scan.id,
        risk_score=int(scan.risk_score),
        risk_level=scan.risk_level,
        explanation=scan.explanation,
        timestamp=scan.timestamp.isoformat(),
        scan_type="fraud_detection"
    )


@router.delete("/{scan_id}")
async def delete_scan(
    scan_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Delete a scan record
    """
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    db.delete(scan)
    db.commit()
    return {"success": True, "message": "Scan deleted successfully"}

    