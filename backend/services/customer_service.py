from datetime import datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.schemas.customer import CustomerCreate, CustomerUpdate
from backend.utils.serializers import serialize_doc


def _serialize(doc: dict) -> dict:
    return serialize_doc(doc, id_alias="customer_id")


async def create_customer(
    payload: CustomerCreate, owner_id: str, db: AsyncIOMotorDatabase
) -> dict[str, Any]:
    doc = {
        "owner_id": owner_id,
        "name": payload.name,
        "phone": payload.phone,
        "email": payload.email,
        "address": payload.address,
        "total_udhaar": payload.initial_udhaar,
        "transactions_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db.customers.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize(doc)


async def list_customers(owner_id: str, db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 50) -> list[dict]:
    cursor = db.customers.find({"owner_id": owner_id}).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_serialize(d) for d in docs]


async def get_customer_by_id(
    customer_id: str, owner_id: str, db: AsyncIOMotorDatabase
) -> dict | None:
    try:
        oid = ObjectId(customer_id)
    except Exception:
        return None
    doc = await db.customers.find_one({"_id": oid, "owner_id": owner_id})
    return _serialize(doc) if doc else None


async def update_customer(
    customer_id: str, owner_id: str, payload: CustomerUpdate, db: AsyncIOMotorDatabase
) -> dict | None:
    try:
        oid = ObjectId(customer_id)
    except Exception:
        return None
    
    update_data = payload.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.customers.find_one_and_update(
        {"_id": oid, "owner_id": owner_id},
        {"$set": update_data},
        return_document=True
    )
    return _serialize(result) if result else None


async def delete_customer(
    customer_id: str, owner_id: str, db: AsyncIOMotorDatabase
) -> bool:
    try:
        oid = ObjectId(customer_id)
    except Exception:
        return False
    
    result = await db.customers.delete_one({"_id": oid, "owner_id": owner_id})
    return result.deleted_count > 0
