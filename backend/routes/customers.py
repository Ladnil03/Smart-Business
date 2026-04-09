from fastapi import APIRouter, HTTPException, status, Query
from bson import ObjectId

from backend.schemas.customer import CustomerCreate, CustomerUpdate
from backend.services import customer_service
from backend.utils.dependencies import CurrentUser, Database
from backend.utils.whatsapp import generate_udhaar_reminder

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_customer(
    payload: CustomerCreate, user: CurrentUser, db: Database
) -> dict:
    data = await customer_service.create_customer(payload, user["user_id"], db)
    return {"success": True, "message": "Customer created.", "data": data}


@router.get("", status_code=status.HTTP_200_OK)
async def get_customers(
    user: CurrentUser, 
    db: Database,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200)
) -> dict:
    skip = (page - 1) * limit
    data = await customer_service.list_customers(user["user_id"], db, skip, limit)
    return {"success": True, "message": "Customers fetched.", "data": data}


@router.get("/{customer_id}", status_code=status.HTTP_200_OK)
async def get_customer(
    customer_id: str, user: CurrentUser, db: Database
) -> dict:
    customer = await customer_service.get_customer_by_id(customer_id, user["user_id"], db)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    
    # Fetch recent transactions for the preview
    try:
        cust_oid = ObjectId(customer_id)
        transactions = await db.transactions.find(
            {"customer_id": str(cust_oid), "owner_id": user["user_id"]}
        ).sort("created_at", -1).limit(5).to_list(length=5)
        recent_transactions = [
            {
                "_id": str(t["_id"]),
                "customer_id": t.get("customer_id"),
                "owner_id": t.get("owner_id"),
                "type": t.get("type"),
                "amount": t.get("amount"),
                "note": t.get("note"),
                "created_at": t.get("created_at").isoformat() if t.get("created_at") else None,
            }
            for t in transactions
        ]
    except Exception:
        recent_transactions = []
    
    return {
        "success": True,
        "message": "Customer fetched.",
        "data": {"customer": customer, "recent_transactions": recent_transactions}
    }


@router.get("/{customer_id}/whatsapp-reminder", status_code=status.HTTP_200_OK)
async def get_whatsapp_reminder(
    customer_id: str, user: CurrentUser, db: Database
) -> dict:
    customer = await customer_service.get_customer_by_id(customer_id, user["user_id"], db)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    
    if customer.get("total_udhaar", 0) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No outstanding udhaar")
    
    # Fetch shop owner details
    try:
        owner_oid = ObjectId(user["user_id"])
        owner = await db.users.find_one({"_id": owner_oid})
        shop_name = owner.get("shop_name", "Our Store") if owner else "Our Store"
    except Exception:
        shop_name = "Our Store"
    
    # Generate WhatsApp URL
    url = generate_udhaar_reminder(
        name=customer.get("name", "Customer"),
        phone=customer.get("phone"),
        amount=customer.get("total_udhaar", 0),
        shop_name=shop_name
    )
    
    return {
        "success": True,
        "message": "Link generated.",
        "data": {"url": url}
    }


@router.put("/{customer_id}", status_code=status.HTTP_200_OK)
async def update_customer(
    customer_id: str, payload: CustomerUpdate, user: CurrentUser, db: Database
) -> dict:
    data = await customer_service.update_customer(customer_id, user["user_id"], payload, db)
    if data is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return {"success": True, "message": "Customer updated.", "data": data}


@router.delete("/{customer_id}", status_code=status.HTTP_200_OK)
async def delete_customer(
    customer_id: str, user: CurrentUser, db: Database
) -> dict:
    deleted = await customer_service.delete_customer(customer_id, user["user_id"], db)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return {"success": True, "message": "Customer deleted."}
