import asyncio


def _extract_features_sync(input_data: str) -> dict:
    # Placeholder transformer. Replace with production feature extraction logic.
    return {
        "input_length": len(input_data),
        "has_url": int("http://" in input_data or "https://" in input_data),
        "word_count": len(input_data.split()),
        "contains_suspicious_terms": int(any(term in input_data.lower() for term in ["fraud", "chargeback", "unauthorized", "scam"])),
    }


async def extract_features(input_data: str) -> dict:
    return await asyncio.to_thread(_extract_features_sync, input_data)