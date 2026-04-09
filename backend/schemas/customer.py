from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class CustomerCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=7, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, max_length=500)
    initial_udhaar: float = 0.0


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, min_length=7, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, max_length=500)
