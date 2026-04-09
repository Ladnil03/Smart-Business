from fastapi import APIRouter, HTTPException, status, Query

from backend.schemas.customer import CustomerCreate, CustomerUpdate
from backend.services import customer_service
from backend.utils.dependencies import CurrentUser, Database

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
