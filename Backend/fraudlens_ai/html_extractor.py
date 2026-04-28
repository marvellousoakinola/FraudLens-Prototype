import re
from typing import Any, Optional
from urllib.parse import urljoin, urlparse

from .logger import get_logger

logger = get_logger(__name__)

SUSPICIOUS_KEYWORDS = [
    "verify",
    "confirm",
    "update",
    "urgent",
    "action",
    "click",
    "immediately",
    "password",
    "credit card",
    "social security",
    "bank account",
    "login",
    "sign in",
    "confirm identity",
    "re-enter",
    "validate",
]


def _extract_text_from_html(html: str) -> str:
    """Extract visible text from HTML, removing scripts and styles."""
    html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", html).strip()
    return text[:5000]


def _extract_title(html: str) -> str:
    """Extract page title from HTML."""
    match = re.search(r"<title[^>]*>([^<]+)</title>", html, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""


def _extract_forms(html: str, base_url: str) -> list[dict[str, Any]]:
    """Extract form fields and targets from HTML."""
    forms = []
    form_pattern = r'<form[^>]*(?:action="([^"]*)")?[^>]*>(.*?)</form>'

    for match in re.finditer(form_pattern, html, re.IGNORECASE | re.DOTALL):
        action = match.group(1) or ""
        form_content = match.group(2)

        if action:
            action = urljoin(base_url, action)

        input_pattern = r'<input[^>]*(?:name="([^"]*)")?[^>]*(?:type="([^"]*)")?[^>]*>'
        inputs = []
        for input_match in re.finditer(input_pattern, form_content, re.IGNORECASE):
            name = input_match.group(1) or ""
            input_type = input_match.group(2) or "text"
            if name:
                inputs.append({"name": name, "type": input_type})

        if action or inputs:
            forms.append({"action": action, "inputs": inputs})

    return forms


def _extract_links(html: str, base_url: str) -> list[str]:
    """Extract links from HTML."""
    links = []
    link_pattern = r'<a[^>]*href="([^"]*)"'

    for match in re.finditer(link_pattern, html, re.IGNORECASE):
        href = match.group(1)
        if href and not href.startswith(("#", "javascript:", "mailto:")):
            absolute_url = urljoin(base_url, href)
            links.append(absolute_url)

    return list(set(links))[:20]


def _detect_suspicious_signals(html: str, text: str) -> list[str]:
    """Detect common phishing and fraud patterns."""
    signals = []

    text_lower = text.lower()

    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in text_lower:
            signals.append(f"contains_{keyword.replace(' ', '_')}")

    if re.search(r"password.*input", html, re.IGNORECASE):
        signals.append("password_field_present")

    if re.search(r"credit.?card|card.?number|cvv|cvc", html, re.IGNORECASE):
        signals.append("credit_card_field_present")

    if re.search(r"social.?security|ssn", html, re.IGNORECASE):
        signals.append("ssn_field_present")

    form_count = len(re.findall(r"<form", html, re.IGNORECASE))
    if form_count > 2:
        signals.append(f"multiple_forms_{form_count}")

    if re.search(r"<iframe", html, re.IGNORECASE):
        signals.append("contains_iframes")

    if re.search(r"onclick=|onload=|onsubmit=", html, re.IGNORECASE):
        signals.append("contains_event_handlers")

    if len(html) > 500000:
        signals.append("extremely_large_page")

    return list(set(signals))


def extract_html_intelligence(html: str, url: str) -> dict[str, Any]:
    """
    Convert raw HTML into structured intelligence.

    Args:
        html: Raw HTML content
        url: Original URL (for context and link resolution)

    Returns:
        Structured intelligence dict
    """
    if not html or len(html) < 50:
        logger.warning("HTML too small or empty from %s", url)
        return {
            "title": "",
            "text": "",
            "forms": [],
            "links": [],
            "suspicious_signals": [],
            "metadata": {"url": url, "html_length": len(html)},
        }

    title = _extract_title(html)
    text = _extract_text_from_html(html)
    forms = _extract_forms(html, url)
    links = _extract_links(html, url)
    signals = _detect_suspicious_signals(html, text)

    return {
        "title": title,
        "text": text,
        "forms": forms,
        "links": links,
        "suspicious_signals": signals,
        "metadata": {
            "url": url,
            "html_length": len(html),
            "extracted_text_length": len(text),
            "form_count": len(forms),
            "link_count": len(links),
        },
    }


def intelligence_to_prompt(intelligence: dict[str, Any]) -> str:
    """
    Convert structured intelligence into a fraud-analysis prompt.

    Args:
        intelligence: Output from extract_html_intelligence()

    Returns:
        Formatted string for AI analysis
    """
    parts = []

    if intelligence.get("title"):
        parts.append(f"Page Title: {intelligence['title']}")

    if intelligence.get("text"):
        parts.append(f"Page Content:\n{intelligence['text'][:2000]}")

    if intelligence.get("forms"):
        forms_desc = []
        for form in intelligence["forms"]:
            inputs_str = ", ".join([f"{inp['name']} ({inp['type']})" for inp in form.get("inputs", [])])
            forms_desc.append(f"Form → {form.get('action', 'no_action')} with fields: {inputs_str}")
        parts.append("Forms Detected:\n" + "\n".join(forms_desc))

    if intelligence.get("suspicious_signals"):
        parts.append(f"Suspicious Signals: {', '.join(intelligence['suspicious_signals'])}")

    if intelligence.get("metadata"):
        meta = intelligence["metadata"]
        parts.append(f"Metadata: URL={meta['url']}, Forms={meta['form_count']}, Links={meta['link_count']}")

    return "\n\n".join(parts)
