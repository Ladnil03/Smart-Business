from typing import Optional
from pydantic import BaseModel, Field


class BillItemInput(BaseModel):
    product_id: str
    qty: int = Field(gt=0)


class BillCreate(BaseModel):
    customer_id: Optional[str] = None
    items: list[BillItemInput] = Field(min_length=1)
    paid: bool
