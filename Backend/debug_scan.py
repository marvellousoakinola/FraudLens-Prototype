from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import asyncio
from app.services.scan import analyze_payload
from app.db.deps import get_db
from app.models.scan import Scan
from sqlalchemy.orm import Session

app = FastAPI()

class ScanRequest(BaseModel):
    data: str

class ScanResponse(BaseModel):
    scan_id: str
    risk_score: int
    risk_level: str
    explanation: str
    timestamp: str
    scan_type: str

@app.post("/scan")
async def test_scan_endpoint(request: ScanRequest, db: Session = Depends(get_db)):
    try:
        print(f"🔍 Received scan request: {request.data}")
        
        # Test AI analysis
        result = await analyze_payload(request.data)
        print(f"🤖 AI analysis result: {result}")
        
        # Test database save
        scan = Scan(
            id="test-123",
            data=request.data,
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            explanation=", ".join(result["explanation"])
        )
        
        db.add(scan)
        db.commit()
        print("💾 Database save successful")
        
        return {
            "scan_id": scan.id,
            "risk_score": int(scan.risk_score),
            "risk_level": scan.risk_level,
            "explanation": scan.explanation,
            "timestamp": scan.timestamp.isoformat(),
            "scan_type": "test"
        }
        
    except Exception as e:
        print(f"❌ Error in scan endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
