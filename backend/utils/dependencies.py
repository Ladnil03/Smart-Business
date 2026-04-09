from typing import Annotated
import logging

from fastapi import Depends, HTTPException, status, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.database.connection import get_db
from backend.utils.jwt_handler import decode_access_token

logger = logging.getLogger(__name__)
_bearer = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(_bearer)],
) -> dict:
    token = credentials.credentials
    logger.info(f'[Auth] Validating token: {token[:20]}...')
    payload = decode_access_token(token)
    
    # Check if token decoding failed
    if payload is None:
        logger.warning('[Auth] Token validation failed - invalid or expired token')
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )
    
    user_id: str | None = payload.get("user_id")
    if not user_id:
        logger.warning('[Auth] Token missing user_id')
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: user_id not found.",
        )
    logger.info(f'[Auth] Token validated for user: {user_id}')
    return {"user_id": user_id, "email": payload.get("email")}


async def get_current_user_download(
    token: str = Query(...),
) -> dict:
    """Dependency for endpoints that require token as query parameter (e.g., file downloads)."""
    logger.info(f'[Auth] Validating download token: {token[:20]}...')
    payload = decode_access_token(token)
    
    if payload is None:
        logger.warning('[Auth] Download token validation failed')
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )
    
    user_id: str | None = payload.get("user_id")
    if not user_id:
        logger.warning('[Auth] Download token missing user_id')
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: user_id not found.",
        )
    logger.info(f'[Auth] Download token validated for user: {user_id}')
    return {"user_id": user_id, "email": payload.get("email")}


# Convenience type aliases used in route signatures
CurrentUser = Annotated[dict, Depends(get_current_user)]
CurrentUserDownload = Annotated[dict, Depends(get_current_user_download)]
Database = Annotated[AsyncIOMotorDatabase, Depends(get_db)]
