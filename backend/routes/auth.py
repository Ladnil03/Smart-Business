from fastapi import APIRouter, HTTPException, status

from backend.schemas.auth import RegisterRequest, LoginRequest
from backend.services import auth_service
from backend.utils.dependencies import Database

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: Database) -> dict:
    result = await auth_service.register_user(payload, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return {"success": True, "message": "User registered successfully.", "data": result}


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(payload: LoginRequest, db: Database) -> dict:
    result = await auth_service.login_user(payload, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=result["error"])
    return {"success": True, "message": "Login successful.", "data": result}
