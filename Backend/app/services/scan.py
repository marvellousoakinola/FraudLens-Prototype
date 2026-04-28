from fraudlens_ai.engine import AIEngine

engine = AIEngine()

async def analyze_payload(data: str):
    result = await engine.assess_risk({
        "input_data": data
    })

    return {
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "explanation": result["explanations"],
        "model_used": result["model_used"]
    }