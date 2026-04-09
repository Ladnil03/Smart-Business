from datetime import datetime
from typing import Any

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from backend.schemas.auth import RegisterRequest, LoginRequest, ProfileUpdateRequest
from backend.utils.jwt_handler import create_access_token

_pwd_hasher = PasswordHasher()


def _hash_password(plain: str) -> str:
    return _pwd_hasher.hash(plain)


def _verify_password(plain: str, hashed: str) -> bool:
    try:
        _pwd_hasher.verify(hashed, plain)
        return True
    except (VerifyMismatchError, InvalidHash):
        return False


def _serialize_user(doc: dict) -> dict:
    doc["user_id"] = str(doc.pop("_id"))
    doc.pop("hashed_password", None)
    if "created_at" in doc:
        doc["created_at"] = doc["created_at"].isoformat()
    return doc


async def register_user(
    payload: RegisterRequest, db: AsyncIOMotorDatabase
) -> dict[str, Any]:
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        return {"error": "Email already registered."}

    user_doc = {
        "full_name": payload.full_name,
        "email": payload.email,
        "hashed_password": _hash_password(payload.password),
        "shop_name": payload.shop_name,
        "phone": payload.phone or "",
        "created_at": datetime.utcnow(),
    }
    result = await db.users.insert_one(user_doc)

    # Return full user + token so frontend can log in immediately after register
    created_user = await db.users.find_one({"_id": result.inserted_id})
    user_data = _serialize_user(created_user)
    token = create_access_token({"user_id": str(result.inserted_id), "email": payload.email})
    return {"access_token": token, "token_type": "bearer", "user": user_data}


async def login_user(
    payload: LoginRequest, db: AsyncIOMotorDatabase
) -> dict[str, Any]:
    user = await db.users.find_one({"email": payload.email})
    if not user or not _verify_password(payload.password, user["hashed_password"]):
        return {"error": "Invalid email or password."}

    user_data = _serialize_user(dict(user))
    token = create_access_token({"user_id": str(user["_id"]), "email": user["email"]})
    return {"access_token": token, "token_type": "bearer", "user": user_data}


async def get_profile(user_id: str, db: AsyncIOMotorDatabase) -> dict[str, Any]:
    """Get user profile by user_id"""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {"error": "User not found."}
        return {"success": True, "data": _serialize_user(dict(user))}
    except Exception as e:
        return {"error": str(e)}


async def update_profile(
    user_id: str, payload: ProfileUpdateRequest, db: AsyncIOMotorDatabase
) -> dict[str, Any]:
    """Update user profile information"""
    try:
        # Check if new email already exists (if email is being changed)
        if payload.email:
            existing = await db.users.find_one({"email": payload.email, "_id": {"$ne": ObjectId(user_id)}})
            if existing:
                return {"error": "Email already in use."}
        
        # Build update dict with only provided fields
        update_data = {}
        if payload.full_name is not None:
            update_data["full_name"] = payload.full_name
        if payload.shop_name is not None:
            update_data["shop_name"] = payload.shop_name
        if payload.phone is not None:
            update_data["phone"] = payload.phone
        if payload.email is not None:
            update_data["email"] = payload.email
        if payload.photo is not None:
            update_data["photo"] = payload.photo

        if not update_data:
            return {"error": "No fields to update."}

        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return {"error": "User not found."}

        # Fetch updated user
        updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
        user_data = _serialize_user(dict(updated_user))
        return {"success": True, "data": user_data}
    except Exception as e:
        return {"error": str(e)}
