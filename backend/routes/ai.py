from fastapi import APIRouter, HTTPException, status

from backend.schemas.ai import AIQuestion
from backend.services.groq_service import ask_groq
from backend.utils.dependencies import CurrentUser, Database

router = APIRouter()


@router.post("/ask", status_code=status.HTTP_200_OK)
async def ask_ai(payload: AIQuestion, user: CurrentUser, db: Database) -> dict:
    answer = await ask_groq(payload.question)
    return {"success": True, "message": "Answer generated.", "data": {"answer": answer}}


@router.get("/insights", status_code=status.HTTP_200_OK)
async def get_insights(user: CurrentUser, db: Database) -> dict:
    owner_id = user["user_id"]

    # Total pending udhaar across all customers
    pipeline_udhaar = [
        {"$match": {"owner_id": owner_id, "total_udhaar": {"$gt": 0}}},
        {"$group": {"_id": None, "total": {"$sum": "$total_udhaar"}}},
    ]
    udhaar_result = await db.customers.aggregate(pipeline_udhaar).to_list(length=1)
    total_pending_udhaar: float = udhaar_result[0]["total"] if udhaar_result else 0.0

    # Low stock items
    low_stock_cursor = db.products.find(
        {"owner_id": owner_id, "$expr": {"$lte": ["$stock", "$low_stock_threshold"]}}
    )
    low_stock_docs = await low_stock_cursor.to_list(length=None)
    low_stock_items = [
        {"name": d["name"], "sku": d["sku"], "stock": d["stock"]}
        for d in low_stock_docs
    ]

    # Top 3 customers by udhaar (descending)
    top_cursor = (
        db.customers.find({"owner_id": owner_id})
        .sort("total_udhaar", -1)
        .limit(3)
    )
    top_docs = await top_cursor.to_list(length=3)
    top_3_customers = [
        {"name": d["name"], "phone": d["phone"], "total_udhaar": d["total_udhaar"]}
        for d in top_docs
    ]

    return {
        "success": True,
        "message": "Insights computed.",
        "data": {
            "total_pending_udhaar": total_pending_udhaar,
            "low_stock_items": low_stock_items,
            "top_3_customers": top_3_customers,
        },
    }
