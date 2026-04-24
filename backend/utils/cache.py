# utils/cache.py
import json
import hashlib
import os
import time
from importlib import import_module

# Upstash Redis is optional; we load it dynamically to avoid hard import failures.
try:
    upstash_module = import_module("upstash_redis")
    UpstashRedis = getattr(upstash_module, "Redis", None)
except Exception:
    UpstashRedis = None

# Redis is optional in local/dev environments where the package may be missing.
try:
    redis = import_module("redis")
except Exception:
    redis = None

# Simple in-process fallback cache: {key: (expires_at_epoch, json_str)}
_fallback_cache: dict[str, tuple[float, str]] = {}

upstash_url = os.getenv("UPSTASH_REDIS_REST_URL")
upstash_token = os.getenv("UPSTASH_REDIS_REST_TOKEN")

# Choose cache backend in order: Upstash -> Redis -> memory fallback.
if UpstashRedis is not None and upstash_url and upstash_token:
    client = UpstashRedis(url=upstash_url, token=upstash_token)
    _client_backend = "upstash"
elif redis is not None:
    client = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        password=os.getenv("REDIS_PASSWORD", None),
        decode_responses=True,
    )
    _client_backend = "redis"
else:
    client = None
    _client_backend = "memory"

# Cache expiry — 24 hours
CACHE_TTL = 60 * 60 * 24

def make_cache_key(feature_key: str, condition: str, extra: dict | None = None) -> str:
    """
    Creates a unique cache key from feature + condition + extra inputs.
    Normalizes the condition so "Acidity" and "acidity" hit the same cache.
    """
    normalized = condition.lower().strip()
    extra = extra or {}
    payload    = json.dumps({
        "feature": feature_key,
        "condition": normalized,
        "extra": extra
    }, sort_keys=True)

    # Hash it to keep keys short and consistent
    hash_key = hashlib.md5(payload.encode()).hexdigest()
    return f"remedy:{feature_key}:{hash_key}"


def get_cached(key: str) -> dict | None:
    """Returns cached result or None if not found."""
    try:
        if client is not None:
            raw = client.get(key)
        else:
            entry = _fallback_cache.get(key)
            if entry is None:
                raw = None
            else:
                expires_at, payload = entry
                if expires_at < time.time():
                    _fallback_cache.pop(key, None)
                    raw = None
                else:
                    raw = payload

        if raw:
            print(f"[Cache] HIT — {key}")
            return json.loads(raw)
        print(f"[Cache] MISS — {key}")
        return None
    except Exception as e:
        print(f"[Cache] Error reading: {e}")
        return None


def set_cached(key: str, data: dict, ttl: int = CACHE_TTL) -> bool:
    """Stores result in Redis with TTL."""
    try:
        payload = json.dumps(data)
        if client is not None:
            if _client_backend == "upstash":
                # Upstash SDK supports TTL through the `ex` argument.
                client.set(key, payload, ex=ttl)
            else:
                client.setex(key, ttl, payload)
        else:
            _fallback_cache[key] = (time.time() + ttl, payload)
        print(f"[Cache] Stored — {key} (TTL: {ttl}s)")
        return True
    except Exception as e:
        print(f"[Cache] Error writing: {e}")
        return False


def delete_cached(key: str) -> bool:
    """Manually invalidate a cache entry."""
    try:
        if client is not None:
            client.delete(key)
        else:
            _fallback_cache.pop(key, None)
        print(f"[Cache] Deleted — {key}")
        return True
    except Exception as e:
        print(f"[Cache] Error deleting: {e}")
        return False


def is_redis_alive() -> bool:
    """Health check for Redis connection."""
    try:
        if client is None:
            return False
        if _client_backend == "upstash":
            # Some Upstash clients may not expose `ping`; a simple read is enough.
            if hasattr(client, "ping"):
                return bool(client.ping())
            client.get("__cache_healthcheck__")
            return True
        return client.ping()
    except Exception:
        return False


def get_cache_stats() -> dict:
    """Returns basic cache statistics."""
    try:
        if client is not None:
            if _client_backend == "upstash":
                try:
                    keys = client.keys("remedy:*") if hasattr(client, "keys") else []
                except Exception:
                    keys = []
                return {
                    "connected": True,
                    "backend": "upstash",
                    "total_keys": len(keys),
                    "used_memory": "N/A",
                    "hits": "N/A",
                    "misses": "N/A",
                    "uptime_hours": "N/A",
                }

            try:
                info = client.info()
                keys = client.keys("remedy:*")
                return {
                    "connected": True,
                    "backend": "redis",
                    "total_keys": len(keys),
                    "used_memory": info.get("used_memory_human", "N/A"),
                    "hits": info.get("keyspace_hits", 0),
                    "misses": info.get("keyspace_misses", 0),
                    "uptime_hours": round(info.get("uptime_in_seconds", 0) / 3600, 1),
                }
            except Exception as e:
                return {
                    "connected": False,
                    "backend": "redis",
                    "error": str(e),
                }

        now = time.time()
        live_keys = 0
        for cache_key, (expires_at, _) in list(_fallback_cache.items()):
            if expires_at < now:
                _fallback_cache.pop(cache_key, None)
            else:
                live_keys += 1

        return {
            "connected": False,
            "backend": "memory",
            "total_keys": live_keys,
            "used_memory": "N/A",
            "hits": "N/A",
            "misses": "N/A",
            "uptime_hours": "N/A",
        }
    except Exception as e:
        return {
            "connected": False,
            "backend": _client_backend,
            "error": str(e),
        }