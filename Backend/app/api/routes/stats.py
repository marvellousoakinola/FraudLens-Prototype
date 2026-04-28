from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.deps import get_db
from app.models.scan import Scan
from app.models.user import User
from app.core.deps import get_current_user
from datetime import datetime, timedelta

router = APIRouter()

# Response Models
class StatsResponse(BaseModel):
    total_scans: int
    threats_detected: int
    safe_requests: int
    detection_rate: float

class TrendData(BaseModel):
    name: str
    load: int
    threats: int

class DistributionData(BaseModel):
    category: str
    value: int
    color: str

class HeroStat(BaseModel):
    label: str
    value: str
    trend: str
    up: bool

class AnalyticsResponse(BaseModel):
    data: List[TrendData]
    distribution: List[DistributionData]
    hero: List[HeroStat]

class SummaryItem(BaseModel):
    name: str
    value: int

class VirusItem(BaseModel):
    name: str
    value: int
    color: str

class DashboardStats(BaseModel):
    activeStreams: int
    nodesOperational: int
    riskScore: int
    status: str
    summaryData: List[SummaryItem]
    virusData: List[VirusItem]

@router.get("/", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Get basic statistics for the dashboard
    """
    total = db.query(func.count(Scan.id)).filter(Scan.user_id == user.id).scalar() or 0
    threats = db.query(func.count(Scan.id)).filter(
        Scan.user_id == user.id, 
        Scan.risk_level == "high"
    ).scalar() or 0
    
    risk_score = (threats / total * 100) if total > 0 else 0
    status = "SECURE" if risk_score < 30 else "VULNERABLE" if risk_score < 70 else "CRITICAL"
    
    # Summary data (last 12 months)
    summary = []
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for month in months:
        # Mocking some trend data for now
        summary.append(SummaryItem(name=month, value=int(risk_score * (0.8 + 0.4 * (months.index(month) / 12)))))

    # Virus data
    virus = [
        VirusItem(name="Malware", value=int(threats * 0.4), color="#7c3ced"),
        VirusItem(name="Phishing", value=int(threats * 0.3), color="#f59e0b"),
        VirusItem(name="Ransomware", value=int(threats * 0.2), color="#ef4444"),
        VirusItem(name="Other", value=int(threats * 0.1), color="#1a1b2e"),
    ]
    
    return DashboardStats(
        activeStreams=total,
        nodesOperational=14,
        riskScore=int(risk_score),
        status=status,
        summaryData=summary,
        virusData=virus
    )

@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Get detailed analytics data
    """
    # Trends (last 7 days)
    trends = []
    for i in range(6, -1, -1):
        date = (datetime.utcnow() - timedelta(days=i)).date()
        day_name = (datetime.utcnow() - timedelta(days=i)).strftime("%a")
        
        day_total = db.query(func.count(Scan.id)).filter(
            Scan.user_id == user.id,
            func.date(Scan.timestamp) == date
        ).scalar() or 0
        
        day_threats = db.query(func.count(Scan.id)).filter(
            Scan.user_id == user.id,
            Scan.risk_level == "high",
            func.date(Scan.timestamp) == date
        ).scalar() or 0
        
        trends.append(TrendData(name=day_name, load=day_total, threats=day_threats))
    
    # Risk distribution
    dist_results = (
        db.query(Scan.risk_level, func.count(Scan.id))
        .filter(Scan.user_id == user.id)
        .group_by(Scan.risk_level)
        .all()
    )
    
    colors = {
        "low": "#10b981",
        "medium": "#f59e0b",
        "high": "#ef4444",
        "critical": "#7f1d1d"
    }
    
    total_scans = sum(count for _, count in dist_results) or 1
    distribution = [
        DistributionData(
            category=level.capitalize(),
            value=int(count / total_scans * 100),
            color=colors.get(level.lower(), "#7c3ced")
        )
        for level, count in dist_results
    ]
    
    # Hero stats
    total = db.query(func.count(Scan.id)).filter(Scan.user_id == user.id).scalar() or 0
    threats = db.query(func.count(Scan.id)).filter(
        Scan.user_id == user.id, 
        Scan.risk_level == "high"
    ).scalar() or 0
    
    hero = [
        HeroStat(label="Total Scans", value=str(total), trend="12%", up=True),
        HeroStat(label="Threats Found", value=str(threats), trend="5%", up=False),
        HeroStat(label="Detection Rate", value=f"{round(threats/total*100, 1) if total > 0 else 0}%", trend="2%", up=True),
        HeroStat(label="System Health", value="98%", trend="Stable", up=True)
    ]
    
    return AnalyticsResponse(
        data=trends,
        distribution=distribution,
        hero=hero
    )