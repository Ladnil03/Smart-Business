from datetime import datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.schemas.transaction import TransactionCreate
from backend.utils.serializers import serialize_doc


def _serialize(doc: dict) -> dict:
    return serialize_doc(doc)


async def create_transaction(
    payload: TransactionCreate, owner_id: str, db: AsyncIOMotorDatabase
) -> dict[str, Any] | str:
    # Verify the customer belongs to this owner
    try:
        cust_oid = ObjectId(payload.customer_id)
    except Exception:
        return "Invalid customer_id format."

    customer = await db.customers.find_one({"_id": cust_oid, "owner_id": owner_id})
    if not customer:
        return "Customer not found."

    doc = {
        "customer_id": payload.customer_id,
        "owner_id": owner_id,
        "type": payload.type,
        "amount": payload.amount,
        "note": payload.note,
        "created_at": datetime.utcnow(),
    }
    result = await db.transactions.insert_one(doc)
    doc["_id"] = result.inserted_id

    # Atomic udhaar update — positive delta for credit, negative for payment
    delta = payload.amount if payload.type == "credit" else -payload.amount
    await db.customers.update_one(
        {"_id": cust_oid},
        [
            {
                "$set": {
                    "total_udhaar": { "$max": [{ "$add": ["$total_udhaar", delta] }, 0] },
                    "transactions_count": { "$add": ["$transactions_count", 1] }
                }
            }
        ]
    )

    return _serialize(doc)


async def list_transactions_for_customer(
    customer_id: str, owner_id: str, db: AsyncIOMotorDatabase
) -> list[dict] | str:
    try:
        ObjectId(customer_id)  # validate format only
    except Exception:
        return "Invalid customer_id format."

    customer = await db.customers.find_one(
        {"_id": ObjectId(customer_id), "owner_id": owner_id}
    )
    if not customer:
        return "Customer not found."

    cursor = db.transactions.find(
        {"customer_id": customer_id, "owner_id": owner_id}
    ).sort("created_at", -1)

    docs = await cursor.to_list(length=None)
    return [_serialize(d) for d in docs]
