from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.database.connection import get_db
from backend.utils.jwt_handler import decode_access_token

_bearer = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(_bearer)],
) -> dict:
    token = credentials.credentials
    payload = decode_access_token(token)
    
    # Check if token decoding failed
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )
    
    user_id: str | None = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: user_id not found.",
        )
    return {"user_id": user_id, "email": payload.get("email")}


# Convenience type aliases used in route signatures
CurrentUser = Annotated[dict, Depends(get_current_user)]
Database = Annotated[AsyncIOMotorDatabase, Depends(get_db)]
