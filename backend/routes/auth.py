from fastapi import APIRouter, HTTPException, status, Request

from backend.schemas.auth import RegisterRequest, LoginRequest, ProfileUpdateRequest
from backend.services import auth_service
from backend.utils.dependencies import Database, CurrentUser
from backend.middleware.rate_limit import limiter

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, payload: RegisterRequest, db: Database) -> dict:
    result = await auth_service.register_user(payload, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return {"success": True, "message": "User registered successfully.", "data": result}


@router.post("/login", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def login(request: Request, payload: LoginRequest, db: Database) -> dict:
    result = await auth_service.login_user(payload, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=result["error"])
    return {"success": True, "message": "Login successful.", "data": result}


@router.get("/profile")
async def get_profile(current_user: CurrentUser, db: Database) -> dict:
    """Get current user's profile"""
    result = await auth_service.get_profile(current_user["user_id"], db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result["error"])
    return result


@router.put("/profile")
async def update_profile(
    payload: ProfileUpdateRequest, current_user: CurrentUser, db: Database
) -> dict:
    """Update current user's profile"""
    result = await auth_service.update_profile(current_user["user_id"], payload, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return {"success": True, "message": "Profile updated successfully.", "data": result["data"]}
