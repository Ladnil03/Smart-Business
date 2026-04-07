from datetime import datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.schemas.bill import BillCreate


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    if "created_at" in doc and isinstance(doc["created_at"], datetime):
        doc["created_at"] = doc["created_at"].isoformat()
    return doc


async def create_bill(
    payload: BillCreate, owner_id: str, db: AsyncIOMotorDatabase
) -> dict[str, Any] | str:
    # ── Phase 1: resolve all products and validate stock ─────────────────────
    resolved_items: list[dict] = []
    total: float = 0.0

    for item in payload.items:
        try:
            prod_oid = ObjectId(item.product_id)
        except Exception:
            return f"Invalid product_id: {item.product_id}"

        product = await db.products.find_one({"_id": prod_oid, "owner_id": owner_id})
        if not product:
            return f"Product {item.product_id} not found."
        if product["stock"] < item.qty:
            return (
                f"Insufficient stock for '{product['name']}'. "
                f"Available: {product['stock']}, Requested: {item.qty}"
            )

        line_total = product["price"] * item.qty
        total += line_total
        resolved_items.append(
            {
                "product_id": item.product_id,
                "name": product["name"],
                "qty": item.qty,
                "price": product["price"],
            }
        )

    # ── Phase 2: deduct stock atomically per product ──────────────────────────
    for item in payload.items:
        await db.products.update_one(
            {"_id": ObjectId(item.product_id)},
            {"$inc": {"stock": -item.qty}},
        )

    # ── Phase 3: persist bill ─────────────────────────────────────────────────
    bill_doc: dict[str, Any] = {
        "owner_id": owner_id,
        "customer_id": payload.customer_id,
        "items": resolved_items,
        "total": total,
        "paid": payload.paid,
        "created_at": datetime.utcnow(),
    }
    result = await db.bills.insert_one(bill_doc)
    bill_doc["_id"] = result.inserted_id

    # ── Phase 4: udhaar update for credit sales ───────────────────────────────
    if payload.customer_id and not payload.paid:
        try:
            cust_oid = ObjectId(payload.customer_id)
            customer = await db.customers.find_one(
                {"_id": cust_oid, "owner_id": owner_id}
            )
            if customer:
                await db.customers.update_one(
                    {"_id": cust_oid},
                    {"$inc": {"total_udhaar": total}},
                )
        except Exception:
            pass  # bill is already saved; udhaar update failure is non-fatal here

    return _serialize(bill_doc)


async def list_bills(owner_id: str, db: AsyncIOMotorDatabase) -> list[dict]:
    cursor = db.bills.find({"owner_id": owner_id}).sort("created_at", -1)
    docs = await cursor.to_list(length=None)
    return [_serialize(d) for d in docs]
