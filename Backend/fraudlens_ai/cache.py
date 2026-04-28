import time
from typing import Optional

from .logger import get_logger

logger = get_logger(__name__)

CACHE_TTL_SECONDS = 3600


class URLCache:
    """Simple in-memory cache for scraped content."""

    def __init__(self, ttl: int = CACHE_TTL_SECONDS):
        self.cache: dict[str, tuple[str, float]] = {}
        self.ttl = ttl

    def get(self, url: str) -> Optional[str]:
        """Retrieve cached content if still valid."""
        if url not in self.cache:
            return None

        content, timestamp = self.cache[url]
        if time.time() - timestamp > self.ttl:
            del self.cache[url]
            logger.debug("Cache expired for %s", url)
            return None

        logger.debug("Cache hit for %s", url)
        return content

    def set(self, url: str, content: str) -> None:
        """Store content in cache."""
        self.cache[url] = (content, time.time())
        logger.debug("Cached content for %s (%d bytes)", url, len(content))

    def clear(self) -> None:
        """Clear entire cache."""
        self.cache.clear()
        logger.debug("Cache cleared")

    def stats(self) -> dict:
        """Return cache statistics."""
        return {
            "entries": len(self.cache),
            "ttl_seconds": self.ttl,
        }


_global_cache = URLCache()


def get_cache() -> URLCache:
    """Get global URL cache instance."""
    return _global_cache
