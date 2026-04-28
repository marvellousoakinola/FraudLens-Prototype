from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.db.database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True, index=True)
    data = Column(String)
    risk_score = Column(Float)
    risk_level = Column(String)
    explanation = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user_id = Column(String, ForeignKey("users.id"))