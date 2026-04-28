import re
from typing import Optional
from urllib.parse import urlparse

import httpx

from .cache import get_cache
from .html_extractor import extract_html_intelligence, intelligence_to_prompt
from .logger import get_logger

logger = get_logger(__name__)
MAX_CONTENT_SIZE = 50000
REQUEST_TIMEOUT = 10.0


def _is_valid_url(url: str) -> bool:
    """Validate URL format to prevent injection attacks."""
    try:
        result = urlparse(url)
        return all([result.scheme in ("http", "https"), result.netloc])
    except Exception:
        return False


def _is_suspicious_url(url: str) -> bool:
    """Detect obviously malicious or problematic URLs."""
    suspicious_patterns = [
        r"javascript:",
        r"data:",
        r"file://",
        r"localhost",
        r"127\.0\.0\.1",
        r"192\.168\.",
        r"10\.",
        r"172\.(1[6-9]|2[0-9]|3[01])\.",
    ]
    for pattern in suspicious_patterns:
        if re.search(pattern, url, re.IGNORECASE):
            return True
    return False


async def fetch_url_content(url: str, max_size: int = MAX_CONTENT_SIZE) -> Optional[str]:
    """
    Safely fetch and return page content from a URL.

    Args:
        url: URL to fetch
        max_size: Maximum content size in bytes

    Returns:
        Page content (truncated to max_size) or None if fetch failed
    """
    if not _is_valid_url(url):
        logger.warning("Invalid URL format: %s", url)
        return None

    if _is_suspicious_url(url):
        logger.warning("Suspicious URL detected: %s", url)
        return None

    try:
        headers = {
            "User-Agent": "FraudLensBot/1.0 (Security Analysis)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "DNT": "1",
            "Connection": "close",
        }

        async with httpx.AsyncClient(
            timeout=REQUEST_TIMEOUT,
            follow_redirects=True,
        ) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()

            content = response.text[:max_size]
            logger.info("Successfully fetched %d bytes from %s", len(content), url)
            return content

    except httpx.TimeoutException:
        logger.warning("Timeout fetching %s", url)
        return None
    except httpx.HTTPError as exc:
        logger.warning("HTTP error fetching %s: %s", url, exc)
        return None
    except Exception as exc:
        logger.warning("Unexpected error fetching %s: %s", url, exc)
        return None


async def enrich_input_with_url_content(input_data: str) -> str:
    """
    If input is a URL, fetch its content, extract intelligence, and enrich the input.

    Args:
        input_data: URL or plain text

    Returns:
        Enriched input data (with structured intelligence if URL) or original input
    """
    if not input_data.startswith(("http://", "https://")):
        return input_data

    cache = get_cache()
    cached_html = cache.get(input_data)

    if cached_html:
        html_content = cached_html
    else:
        html_content = await fetch_url_content(input_data)
        if html_content:
            cache.set(input_data, html_content)

    if not html_content:
        return input_data

    intelligence = extract_html_intelligence(html_content, input_data)
    prompt = intelligence_to_prompt(intelligence)

    return prompt
