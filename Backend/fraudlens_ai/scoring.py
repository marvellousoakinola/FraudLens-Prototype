from typing import Any


def calculate_rule_score(features: dict[str, Any]) -> float:
    score = 0.0
    score += min(features.get("input_length", 0) / 10.0, 20.0)
    score += 30.0 if features.get("has_url") else 0.0
    score += 20.0 if features.get("contains_suspicious_terms") else 0.0
    score += min(features.get("word_count", 0) / 5.0, 20.0)
    return min(max(score, 0.0), 100.0)


def fuse_scores(rule_score: float, ai_score: float) -> float:
    return min(max(0.4 * rule_score + 0.6 * ai_score, 0.0), 100.0)


def assign_risk_level(risk_score: float) -> str:
    if risk_score >= 80.0:
        return "high"
    if risk_score >= 40.0:
        return "medium"
    return "low"


def build_rule_explanation(rule_score: float, features: dict[str, Any]) -> str:
    return f"rule_score={rule_score:.2f}, features={features}"