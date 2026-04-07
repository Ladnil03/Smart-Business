from fastapi import APIRouter, HTTPException, status

from backend.schemas.transaction import TransactionCreate
from backend.services import transaction_service
from backend.utils.dependencies import CurrentUser, Database

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_transaction(
    payload: TransactionCreate, user: CurrentUser, db: Database
) -> dict:
    result = await transaction_service.create_transaction(payload, user["user_id"], db)
    if isinstance(result, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST if "Invalid" not in result
            else status.HTTP_400_BAD_REQUEST,
            detail=result,
        )
    return {"success": True, "message": "Transaction recorded.", "data": result}


@router.get("/customers/{customer_id}/transactions", status_code=status.HTTP_200_OK)
async def get_customer_transactions(
    customer_id: str, user: CurrentUser, db: Database
) -> dict:
    result = await transaction_service.list_transactions_for_customer(
        customer_id, user["user_id"], db
    )
    if isinstance(result, str):
        code = status.HTTP_404_NOT_FOUND if "not found" in result else status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=code, detail=result)
    return {"success": True, "message": "Transactions fetched.", "data": result}
