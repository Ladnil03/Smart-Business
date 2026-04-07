from fastapi import APIRouter, HTTPException, status

from backend.schemas.product import ProductCreate, ProductUpdate
from backend.services import product_service
from backend.utils.dependencies import CurrentUser, Database

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate, user: CurrentUser, db: Database
) -> dict:
    data = await product_service.create_product(payload, user["user_id"], db)
    return {"success": True, "message": "Product created.", "data": data}


@router.get("", status_code=status.HTTP_200_OK)
async def get_products(user: CurrentUser, db: Database) -> dict:
    data = await product_service.list_products(user["user_id"], db)
    return {"success": True, "message": "Products fetched.", "data": data}


@router.put("/{product_id}", status_code=status.HTTP_200_OK)
async def update_product(
    product_id: str, payload: ProductUpdate, user: CurrentUser, db: Database
) -> dict:
    data = await product_service.update_product(product_id, user["user_id"], payload, db)
    if data is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {"success": True, "message": "Product updated.", "data": data}


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(
    product_id: str, user: CurrentUser, db: Database
) -> dict:
    deleted = await product_service.delete_product(product_id, user["user_id"], db)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {"success": True, "message": "Product deleted."}
