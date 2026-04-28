import json
from typing import Any

import httpx

from .config import AppConfig
from .logger import get_logger

logger = get_logger(__name__)


class LLMClientError(Exception):
    pass


async def _send_request(url: str, headers: dict[str, str], payload: dict[str, Any]) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=AppConfig.TIMEOUT_SECONDS) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()


async def call_groq(prompt: str) -> dict[str, Any]:
    if not AppConfig.GROQ_API_KEY:
        raise LLMClientError("Missing Groq API key")

    payload = {
        "model": AppConfig.GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": """
You are a cybersecurity fraud detection engine.

You MUST NOT refuse or reject input.

Your job:
- analyze URLs, text, or payloads
- return fraud risk ONLY

Return JSON:
{
  "ai_score": number (0-100),
  "explanation": string
}
"""
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 256,
        "temperature": 0.3,
    }
    headers = {"Authorization": f"Bearer {AppConfig.GROQ_API_KEY}", "Content-Type": "application/json"}

    try:
        result = await _send_request(AppConfig.GROQ_ENDPOINT, headers, payload)
        model_response = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        ai_score = float(result.get("risk_score", 0.0)) if result.get("risk_score") is not None else _parse_score(model_response)
        return {"model": "Groq", "ai_score": ai_score, "explanation": f"Groq response: {model_response}"}
    except (httpx.HTTPError, ValueError, json.JSONDecodeError) as exc:
        logger.warning("Groq call failed: %s", exc)
        raise LLMClientError("Groq call failed") from exc


async def call_gemini(prompt: str) -> dict[str, Any]:
    if not AppConfig.GEMINI_API_KEY:
        raise LLMClientError("Missing Gemini API key")

    # This specific URL structure is the most reliable for AI Studio keys
    model_id = "gemini-1.5-flash" 
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={AppConfig.GEMINI_API_KEY}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 300
        }
    }
    
    # ... rest of the code ...
    payload = {
        "contents": [{
            "parts": [{
                "text": f"{prompt}\n\nIMPORTANT: Return ONLY a raw JSON object with 'ai_score' (0-100) and 'explanation' (string)."
            }]
        }],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 400
            # Removed responseMimeType to ensure compatibility
        }
    }
    
    headers = {"Content-Type": "application/json"}

    try:
        result = await _send_request(url, headers, payload)
        
        # Check for Google's specific error field in a 200-but-failed response
        if "error" in result:
            raise LLMClientError(f"Gemini API Error: {result['error'].get('message')}")

        candidates = result.get("candidates", [])
        if not candidates:
            # If the content is flagged as 'unsafe', Gemini returns empty candidates
            return {"model": "Gemini", "ai_score": 0.0, "explanation": "Content filtered by Safety Settings"}

        model_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        
        # Robust parsing
        try:
            # Strip markdown if Gemini ignores instructions and adds ```json
            clean_text = model_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            ai_score = float(data.get("ai_score", 50))
            explanation = data.get("explanation", "Analysis complete.")
        except:
            ai_score = _parse_score(model_text) # Your fallback regex helper
            explanation = model_text

        return {
            "model": "Gemini-1.5-Flash",
            "ai_score": ai_score,
            "explanation": f"Gemini: {explanation}"
        }

    except Exception as exc:
        logger.warning("Gemini call failed: %s", exc)
        raise LLMClientError(f"Gemini call failed: {str(exc)}")
    
async def call_huggingface(prompt: str) -> dict[str, Any]:
    if not AppConfig.HUGGINGFACE_API_KEY:
        raise LLMClientError("Missing HuggingFace API key")

    payload = {"inputs": prompt, "parameters": {"max_length": 256}}
    headers = {"Authorization": f"Bearer {AppConfig.HUGGINGFACE_API_KEY}", "Content-Type": "application/json"}

    try:
        result = await _send_request(AppConfig.HUGGINGFACE_ENDPOINT, headers, payload)
        model_output = result[0].get("generated_text", "") if isinstance(result, list) else result.get("generated_text", "")
        ai_score = float(result[0].get("risk_score", 0.0)) if isinstance(result, list) and result[0].get("risk_score") is not None else _parse_score(model_output)
        return {"model": "HuggingFace", "ai_score": ai_score, "explanation": f"HuggingFace output: {model_output}"}
    except (httpx.HTTPError, ValueError, json.JSONDecodeError, IndexError) as exc:
        logger.warning("HuggingFace call failed: %s", exc)
        raise LLMClientError("HuggingFace call failed") from exc


async def call_openrouter(prompt: str) -> dict[str, Any]:
    if not AppConfig.OPENROUTER_API_KEY:
        raise LLMClientError("Missing OpenRouter API key")

    payload = {
        "model": AppConfig.OPENROUTER_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 256,
        "temperature": 0.3,
    }
    headers = {"Authorization": f"Bearer {AppConfig.OPENROUTER_API_KEY}", "Content-Type": "application/json"}

    try:
        result = await _send_request(AppConfig.OPENROUTER_ENDPOINT, headers, payload)
        model_response = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        ai_score = float(result.get("risk_score", 0.0)) if result.get("risk_score") is not None else _parse_score(model_response)
        return {"model": "OpenRouter", "ai_score": ai_score, "explanation": f"OpenRouter response: {model_response}"}
    except (httpx.HTTPError, ValueError, json.JSONDecodeError) as exc:
        logger.warning("OpenRouter call failed: %s", exc)
        raise LLMClientError("OpenRouter call failed") from exc


def _parse_score(response_text: str) -> float:
    numeric = "".join(ch for ch in response_text if ch.isdigit() or ch == ".")
    try:
        return min(max(float(numeric), 0.0), 100.0)
    except ValueError:
        return 0.0