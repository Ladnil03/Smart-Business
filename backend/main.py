from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database.connection import connect_db, close_db
from backend.routes import auth, customers, transactions, products, bills, ai
from backend.utils.dependencies import CurrentUser
from backend.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Smart Udhaar & Store Manager API",
    description="Credit & inventory management for small Indian retail shops.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/auth",         tags=["Auth"])
app.include_router(customers.router,    prefix="/customers",    tags=["Customers"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
# Also mount under /customers so GET /customers/{id}/transactions resolves
app.include_router(transactions.router, prefix="/customers",    tags=["Transactions"], include_in_schema=False)
app.include_router(products.router,     prefix="/products",     tags=["Products"])
app.include_router(bills.router,        prefix="/bills",        tags=["Bills"])
app.include_router(ai.router,           prefix="/ai",           tags=["AI"])


@app.get("/", tags=["Health"])
async def health_check() -> dict:
    return {"success": True, "message": "Smart Udhaar & Store Manager is running.", "data": None}


@app.get("/auth/me", tags=["Auth"])
async def get_current_user_info(user: CurrentUser) -> dict:
    return {"success": True, "message": "Current user.", "data": user}
