import sys
import os
from pathlib import Path
from contextlib import asynccontextmanager
from typing import AsyncGenerator

# Handle imports from both project root and backend directory
current_dir = Path(__file__).parent
project_root = current_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from backend.database.connection import connect_db, close_db
from backend.routes import auth, customers, transactions, products, bills, ai
from backend.routes.imports import router as import_router
from backend.utils.dependencies import CurrentUser
from backend.config import settings
from backend.middleware.rate_limit import limiter


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

# Add rate limit exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
app.include_router(products.router,     prefix="/products",     tags=["Products"])
app.include_router(bills.router,        prefix="/bills",        tags=["Bills"])
app.include_router(ai.router,           prefix="/ai",           tags=["AI"])
app.include_router(import_router,       prefix="/import",       tags=["Import"])


@app.get("/", tags=["Health"])
async def health_check() -> dict:
    return {"success": True, "message": "Smart Udhaar & Store Manager is running.", "data": None}


@app.get("/auth/me", tags=["Auth"])
async def get_current_user_info(user: CurrentUser) -> dict:
    return {"success": True, "message": "Current user.", "data": user}
