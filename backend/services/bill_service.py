from datetime import datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.schemas.bill import BillCreate
from backend.utils.serializers import serialize_doc


def _serialize(doc: dict) -> dict:
    return serialize_doc(doc)


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

        line_total = product["mrp"] * item.qty
        total += line_total
        resolved_items.append(
            {
                "product_id": item.product_id,
                "name": product["name"],
                "qty": item.qty,
                "price": product["mrp"],
            }
        )

    # ── Phase 2: deduct stock with concurrency check ──────────────────────────
    for item in payload.items:
        result = await db.products.update_one(
            {
                "_id": ObjectId(item.product_id),
                "stock": {"$gte": item.qty}  # Only update if enough stock remains
            },
            {"$inc": {"stock": -item.qty}},
        )
        if result.matched_count == 0:
            # Stock unavailable — rollback previous deductions
            for rolled in resolved_items:
                if rolled["product_id"] != item.product_id:
                    await db.products.update_one(
                        {"_id": ObjectId(rolled["product_id"])},
                        {"$inc": {"stock": rolled["qty"]}}
                    )
            return f"Concurrent stock conflict for product '{item.product_id}'. Please try again."

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


async def list_bills(owner_id: str, db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 50) -> list[dict]:
    cursor = db.bills.find({"owner_id": owner_id}).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_serialize(d) for d in docs]
