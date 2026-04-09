from datetime import datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.schemas.product import ProductCreate, ProductUpdate
from backend.utils.serializers import serialize_doc


def _serialize(doc: dict) -> dict:
    return serialize_doc(doc, id_alias="product_id")


def _add_low_stock_flag(doc: dict) -> dict:
    doc["is_low_stock"] = doc["stock"] <= doc.get("low_stock_threshold", 5)
    return doc


async def create_product(
    payload: ProductCreate, owner_id: str, db: AsyncIOMotorDatabase
) -> dict[str, Any]:
    doc = {
        "owner_id": owner_id,
        "name": payload.name,
        "sku": payload.sku,
        "mrp": payload.mrp,
        "cost": payload.cost,
        "stock": payload.stock,
        "low_stock_threshold": payload.low_stock_threshold or 5,
        "category": payload.category,
        "description": payload.description,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db.products.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _add_low_stock_flag(_serialize(doc))


async def list_products(owner_id: str, db: AsyncIOMotorDatabase) -> list[dict]:
    cursor = db.products.find({"owner_id": owner_id})
    docs = await cursor.to_list(length=None)
    return [_add_low_stock_flag(_serialize(d)) for d in docs]


async def get_product_by_id(
    product_id: str, owner_id: str, db: AsyncIOMotorDatabase
) -> dict | None:
    try:
        oid = ObjectId(product_id)
    except Exception:
        return None
    doc = await db.products.find_one({"_id": oid, "owner_id": owner_id})
    return _add_low_stock_flag(_serialize(doc)) if doc else None


async def update_product(
    product_id: str, owner_id: str, payload: ProductUpdate, db: AsyncIOMotorDatabase
) -> dict | None:
    try:
        oid = ObjectId(product_id)
    except Exception:
        return None
    
    update_data = payload.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.products.find_one_and_update(
        {"_id": oid, "owner_id": owner_id},
        {"$set": update_data},
        return_document=True
    )
    return _add_low_stock_flag(_serialize(result)) if result else None


async def delete_product(
    product_id: str, owner_id: str, db: AsyncIOMotorDatabase
) -> bool:
    try:
        oid = ObjectId(product_id)
    except Exception:
        return False
    
    result = await db.products.delete_one({"_id": oid, "owner_id": owner_id})
    return result.deleted_count > 0
