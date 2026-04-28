import importlib
import os
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
DOTENV_PATH = ROOT_DIR / ".env"
load_dotenv = None
if DOTENV_PATH.exists():
    try:
        dotenv = importlib.import_module("dotenv")
        load_dotenv = getattr(dotenv, "load_dotenv", None)
    except ModuleNotFoundError:
        load_dotenv = None

if DOTENV_PATH.exists() and load_dotenv is not None:
    load_dotenv(DOTENV_PATH)


def _get_env_variable(name: str, aliases: list[str] | None = None, default: str | None = None) -> str | None:
    value = os.getenv(name)
    if not value and aliases:
        for alias in aliases:
            value = os.getenv(alias)
            if value:
                break
    return value or default


def get_env_variable(name: str, default: str | None = None, required: bool = False, aliases: list[str] | None = None) -> str | None:
    value = _get_env_variable(name, aliases=aliases, default=default)
    if required and not value:
        raise EnvironmentError(f"Missing required environment variable: {name}")
    return value


class AppConfig:
    GROQ_API_KEY = get_env_variable("FRAUDLENS_GROQ_API_KEY", aliases=["GROQ_API_KEY"])
    GROQ_ENDPOINT = get_env_variable("FRAUDLENS_GROQ_ENDPOINT", "https://api.groq.com/openai/v1/chat/completions")
    GROQ_MODEL = get_env_variable("FRAUDLENS_GROQ_MODEL", "llama-3.1-8b-instant")

    GEMINI_API_KEY = get_env_variable("FRAUDLENS_GEMINI_API_KEY", aliases=["GEMINI_API_KEY"])
    GEMINI_ENDPOINT = get_env_variable("FRAUDLENS_GEMINI_ENDPOINT", "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent")

    HUGGINGFACE_API_KEY = get_env_variable("FRAUDLENS_HUGGINGFACE_API_KEY", aliases=["HF_API_KEY", "HUGGINGFACE_API_KEY"])
    HUGGINGFACE_ENDPOINT = get_env_variable("FRAUDLENS_HUGGINGFACE_ENDPOINT", "https://api-inference.huggingface.co/models/distilbert-base-uncased")

    OPENROUTER_API_KEY = get_env_variable("FRAUDLENS_OPENROUTER_API_KEY", aliases=["OPENROUTER_API_KEY"])
    OPENROUTER_ENDPOINT = get_env_variable("FRAUDLENS_OPENROUTER_ENDPOINT", "https://openrouter.ai/api/v1/chat/completions")
    OPENROUTER_MODEL = get_env_variable("FRAUDLENS_OPENROUTER_MODEL", "meta-llama/llama-2-7b-chat")

    LOG_LEVEL = get_env_variable("FRAUDLENS_LOG_LEVEL", "INFO")
    TIMEOUT_SECONDS = float(get_env_variable("FRAUDLENS_TIMEOUT_SECONDS", "15"))

    @classmethod
    def validate(cls) -> None:
        if not any([cls.GROQ_API_KEY, cls.GEMINI_API_KEY, cls.HUGGINGFACE_API_KEY, cls.OPENROUTER_API_KEY]):
            raise EnvironmentError("At least one LLM API key must be configured in the environment.")