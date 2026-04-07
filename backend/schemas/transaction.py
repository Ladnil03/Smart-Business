from typing import Literal, Optional
from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    customer_id: str
    type: Literal["credit", "payment"]
    amount: float = Field(gt=0, description="Must be positive")
    note: Optional[str] = None
