from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class BillItemModel(BaseModel):
    product_id: str
    name: str
    qty: int
    price: float


class BillModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    owner_id: str
    customer_id: Optional[str] = None
    items: list[BillItemModel]
    total: float
    paid: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True}
