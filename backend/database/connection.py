from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi import HTTPException, status
from backend.config import settings

_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    global _client
    _client = AsyncIOMotorClient(settings.mongodb_url)
    db = _client[settings.db_name]
    
    # Create indexes for multi-tenant queries and uniqueness constraints
    await db.customers.create_index([("owner_id", 1), ("phone", 1)])
    await db.products.create_index([("owner_id", 1), ("sku", 1)], unique=True)
    await db.transactions.create_index([("owner_id", 1), ("customer_id", 1), ("created_at", -1)])
    await db.bills.create_index([("owner_id", 1), ("created_at", -1)])
    await db.users.create_index([("email", 1)], unique=True)


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None


def get_db() -> AsyncIOMotorDatabase:
    if _client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection unavailable. Please try again later."
        )
    return _client[settings.db_name]
