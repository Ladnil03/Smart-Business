from datetime import datetime, timedelta
from typing import Any
import logging

from jose import JWTError, jwt

from backend.config import settings

logger = logging.getLogger(__name__)


def create_access_token(data: dict[str, Any]) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload.update({"exp": expire})
    # Add user info to JWT so frontend can decode it
    if "user_id" in payload and "full_name" not in payload:
        payload.setdefault("full_name", "")
    if "user_id" in payload and "shop_name" not in payload:
        payload.setdefault("shop_name", "")
    encoded = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
    return encoded


def decode_access_token(token: str) -> dict[str, Any] | None:
    try:
        payload: dict[str, Any] = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        return payload
    except JWTError as e:
        logger.warning("JWT decode failed: %s", e)
        return None
