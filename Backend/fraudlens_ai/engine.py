from typing import Any

from .feature_extractor import extract_features
from .ingestion import ingest
from .llm_clients import LLMClientError, call_groq, call_gemini, call_huggingface, call_openrouter
from .logger import get_logger
from .scoring import assign_risk_level, build_rule_explanation, calculate_rule_score

logger = get_logger(__name__)


class AIEngine:
    def __init__(self) -> None:
        pass

    async def assess_risk(self, input_packet: dict[str, Any]) -> dict[str, Any]:
        try:
            if not isinstance(input_packet, dict):
                input_packet = await ingest(str(input_packet))
            elif "raw_text" not in input_packet:
                if "input_data" in input_packet:
                    input_packet = await ingest(
                        str(input_packet["input_data"]),
                        input_packet.get("input_type"),
                    )
                else:
                    input_packet = await ingest(str(input_packet))

            raw_text = input_packet.get("raw_text", "")
            input_type = input_packet.get("input_type", "text")
            metadata = input_packet.get("metadata", {})

            features = await extract_features(raw_text)
            features["input_type"] = input_type
            features["metadata"] = metadata
            rule_score = calculate_rule_score(features)
            rule_explanation = build_rule_explanation(rule_score, features)

            llm_result = await self._evaluate_primary(raw_text, rule_score)
            ai_score = self._normalize_score(llm_result.get("ai_score", 0.0))
            models_used = llm_result["models_used"]
            explanations = [rule_explanation] + llm_result["explanations"]

            ai_weight = 0.7 if input_type == "url" else 0.5
            rule_weight = 1.0 - ai_weight
            final_score = min(max((rule_weight * rule_score) + (ai_weight * ai_score), 0.0), 100.0)

            return {
                "risk_score": round(final_score, 2),
                "risk_level": assign_risk_level(final_score),
                "explanations": explanations,
                "model_used": models_used,
                "input_type": input_type,
                "metadata": metadata,
            }
        except Exception as exc:
            logger.exception("AIEngine failed to assess risk")
            return {
                "risk_score": 0.0,
                "risk_level": "unknown",
                "explanations": [f"engine_error: {exc}"],
                "model_used": ["none"],
                "input_type": "unknown",
                "metadata": {},
            }

    def _normalize_score(self, score: Any) -> float:
        try:
            normalized = float(score)
        except (TypeError, ValueError):
            normalized = 0.0
        return min(max(normalized, 0.0), 100.0)

    async def _evaluate_primary(self, input_data: str, rule_score: float) -> dict[str, Any]:
        llm_explanations: list[str] = []
        models_used: list[str] = []

        try:
            primary_response = await call_groq(input_data)
            models_used.append(primary_response.get("model", "Groq"))
            llm_explanations.append(primary_response.get("explanation", "Groq response received"))
        except LLMClientError:
            logger.info("Primary Groq call failed; attempting Gemini fallback")
            try:
                primary_response = await call_gemini(input_data)
                models_used.append(primary_response.get("model", "Gemini"))
                llm_explanations.append(primary_response.get("explanation", "Gemini response received"))
            except LLMClientError:
                logger.info("Gemini fallback failed; attempting HuggingFace fallback")
                primary_response = await self._call_fallback(input_data)
                models_used.append(primary_response.get("model", "HuggingFace"))
                llm_explanations.append(primary_response.get("explanation", "Fallback response received"))

        return {
            "ai_score": primary_response.get("ai_score", 0.0),
            "models_used": models_used,
            "explanations": llm_explanations,
        }
    async def _call_fallback(self, input_data: str) -> dict[str, Any]:
        try:
            response = await call_huggingface(input_data)
            return response
        except LLMClientError:
            logger.info("HuggingFace failed; attempting OpenRouter final fallback")
            return await call_openrouter(input_data)