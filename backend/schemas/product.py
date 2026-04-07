from typing import Optional
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str
    sku: str
    mrp: float = Field(gt=0)
    cost: float = Field(ge=0)
    stock: int = Field(ge=0)
    low_stock_threshold: Optional[int] = 5
    category: Optional[str] = None
    description: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    mrp: Optional[float] = Field(None, gt=0)
    cost: Optional[float] = Field(None, ge=0)
    stock: Optional[int] = Field(None, ge=0)
    low_stock_threshold: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None
