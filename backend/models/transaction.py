from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field


class TransactionModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    customer_id: str
    owner_id: str
    type: Literal["credit", "payment"]
    amount: float
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True}
