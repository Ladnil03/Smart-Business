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
