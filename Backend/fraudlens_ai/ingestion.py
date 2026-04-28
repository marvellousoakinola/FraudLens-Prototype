import re
from pathlib import Path
from typing import Any

from .html_extractor import extract_html_intelligence, intelligence_to_prompt
from .logger import get_logger
from .web_scraper import fetch_url_content

logger = get_logger(__name__)

EMAIL_SUSPICIOUS_TERMS = [
    "verify",
    "urgent",
    "password",
    "login",
    "bank",
    "account",
    "confirm",
    "security",
    "update",
    "payment",
]

TEXT_FILE_EXTENSIONS = {".txt"}


def parse_email(raw_email: str) -> dict[str, Any]:
    headers, body = (raw_email, "")
    if "\n\n" in raw_email:
        headers, body = raw_email.split("\n\n", 1)

    subject = ""
    sender = ""
    for line in headers.splitlines():
        if line.lower().startswith("subject:"):
            subject = line.split(":", 1)[1].strip()
        elif line.lower().startswith("from:"):
            sender = line.split(":", 1)[1].strip()

    links = re.findall(r"https?://\S+", raw_email)
    suspicious_keywords = [
        term for term in EMAIL_SUSPICIOUS_TERMS if term in raw_email.lower()
    ]

    return {
        "input_type": "email",
        "raw_text": raw_email,
        "metadata": {
            "subject": subject,
            "sender": sender,
            "links": links,
            "suspicious_keywords": suspicious_keywords,
        },
    }


def read_file_content(path: str) -> str:
    resolved = Path(path)
    if not resolved.exists() or not resolved.is_file():
        raise FileNotFoundError(f"File not found: {path}")

    if resolved.suffix.lower() not in TEXT_FILE_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {resolved.suffix}")

    with resolved.open("r", encoding="utf-8", errors="ignore") as file:
        return file.read()


def _detect_input_type(raw_input: str, input_type: str | None = None) -> str:
    if input_type:
        return input_type.lower()

    if raw_input.startswith(("http://", "https://")):
        return "url"

    if Path(raw_input).exists():
        return "file"

    if re.search(r"^subject:|^from:", raw_input, re.IGNORECASE):
        return "email"

    return "text"


async def ingest(raw_input: str, input_type: str | None = None) -> dict[str, Any]:
    input_type = _detect_input_type(raw_input, input_type)

    if input_type == "url":
        html_content = await fetch_url_content(raw_input)
        metadata = {"url": raw_input, "source": "web_scraper"}
        if html_content:
            intelligence = extract_html_intelligence(html_content, raw_input)
            return {
                "input_type": "url",
                "raw_text": intelligence_to_prompt(intelligence),
                "metadata": {**metadata, **intelligence.get("metadata", {})},
            }
        return {
            "input_type": "url",
            "raw_text": raw_input,
            "metadata": {**metadata, "scrape_failed": True},
        }

    if input_type == "email":
        parsed = parse_email(raw_input)
        raw_text = "Subject: " + parsed["metadata"]["subject"] + "\n"
        raw_text += "Sender: " + parsed["metadata"]["sender"] + "\n\n"
        raw_text += "Body:\n" + parsed["raw_text"] + "\n\n"
        raw_text += "Links: " + ", ".join(parsed["metadata"]["links"])
        return {
            "input_type": "email",
            "raw_text": raw_text,
            "metadata": parsed["metadata"],
        }

    if input_type == "file":
        try:
            file_content = read_file_content(raw_input)
        except Exception as exc:
            logger.warning("File ingestion failed for %s: %s", raw_input, exc)
            return {
                "input_type": "file",
                "raw_text": "",
                "metadata": {"path": raw_input, "error": str(exc)},
            }

        return {
            "input_type": "file",
            "raw_text": file_content,
            "metadata": {"path": raw_input, "extension": Path(raw_input).suffix.lower()},
        }

    return {
        "input_type": "text",
        "raw_text": raw_input,
        "metadata": {"source": "raw_text"},
    }
