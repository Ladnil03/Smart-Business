from fastapi import APIRouter, HTTPException, status, Query

from backend.schemas.bill import BillCreate
from backend.services import bill_service
from backend.utils.dependencies import CurrentUser, Database

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_bill(
    payload: BillCreate, user: CurrentUser, db: Database
) -> dict:
    result = await bill_service.create_bill(payload, user["user_id"], db)
    if isinstance(result, str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result)
    return {"success": True, "message": "Bill created.", "data": result}


@router.get("", status_code=status.HTTP_200_OK)
async def get_bills(
    user: CurrentUser,
    db: Database,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200)
) -> dict:
    skip = (page - 1) * limit
    data = await bill_service.list_bills(user["user_id"], db, skip, limit)
    return {"success": True, "message": "Bills fetched.", "data": data}
