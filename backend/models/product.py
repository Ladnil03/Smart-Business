from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProductModel(BaseModel):
    product_id: Optional[str] = Field(default=None, alias="_id")
    owner_id: str
    name: str
    sku: str
    mrp: float
    cost: float
    stock: int
    low_stock_threshold: int = 5
    category: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True}
