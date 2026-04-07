from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CustomerModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    owner_id: str
    name: str
    phone: str
    total_udhaar: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True}
