from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
import pandas as pd
from PyPDF2 import PdfReader
import json
from io import BytesIO

from backend.utils.dependencies import get_db, get_current_user, CurrentUser, Database
from backend.schemas.customer import CustomerCreate
from backend.schemas.product import ProductCreate
from backend.schemas.bill import BillCreate, BillItemInput
from backend.services.customer_service import create_customer
from backend.services.product_service import create_product
from backend.services.bill_service import create_bill

router = APIRouter(tags=["import"])

# Request models
class CustomerImportRequest(BaseModel):
    customers: List[dict]

class ProductImportRequest(BaseModel):
    products: List[dict]

class BillImportRequest(BaseModel):
    bills: List[dict]

# File parsing helpers
async def parse_csv_file(file: UploadFile) -> List[dict]:
    """Parse CSV file and return list of dictionaries"""
    try:
        content = await file.read()
        df = pd.read_csv(BytesIO(content))
        return df.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

async def parse_excel_file(file: UploadFile) -> List[dict]:
    """Parse Excel file and return list of dictionaries"""
    try:
        content = await file.read()
        df = pd.read_excel(BytesIO(content), engine='openpyxl')
        return df.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse Excel: {str(e)}")

async def parse_pdf_file(file: UploadFile) -> List[dict]:
    """Parse PDF file - extracts text tables"""
    try:
        content = await file.read()
        pdf_reader = PdfReader(BytesIO(content))
        
        # Extract text from all pages
        text_content = []
        for page in pdf_reader.pages:
            text_content.append(page.extract_text())
        
        # Try to parse as JSON if formatted that way, otherwise return as text
        data = []
        for page_text in text_content:
            try:
                # Try parsing as JSON array
                if '[' in page_text and ']' in page_text:
                    json_str = page_text[page_text.find('['):page_text.rfind(']')+1]
                    data.extend(json.loads(json_str))
            except:
                # Return as structured text
                data.append({"content": page_text})
        
        return data if data else [{"content": "\n".join(text_content)}]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

def get_file_type(filename: str) -> str:
    """Determine file type from extension"""
    ext = filename.lower().split('.')[-1]
    return ext

# Preview endpoints
@router.post("/preview-customers")
async def preview_customers_import(
    file: UploadFile = File(...)
):
    """Preview customer data from file before import"""
    file_type = get_file_type(file.filename or "")
    
    try:
        if file_type == 'csv':
            data = await parse_csv_file(file)
        elif file_type in ['xlsx', 'xls']:
            data = await parse_excel_file(file)
        elif file_type == 'pdf':
            data = await parse_pdf_file(file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Map columns to expected format
        processed = []
        for row in data:
            customer = {
                "name": row.get("name") or row.get("Name") or row.get("customer_name") or "",
                "phone": str(row.get("phone") or row.get("Phone") or row.get("phone_number") or ""),
                "address": row.get("address") or row.get("Address") or row.get("location") or "",
                "initial_udhaar": float(row.get("initial_udhaar") or row.get("Initial Udhaar") or row.get("total_udhaar") or row.get("Total Udhaar") or row.get("udhaar") or 0),
            }
            # Include row if it has at least a name (for preview purposes)
            if customer["name"]:
                processed.append(customer)
        
        return {"success": True, "data": processed}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@router.post("/preview-products")
async def preview_products_import(
    file: UploadFile = File(...)
):
    """Preview product data from file before import"""
    file_type = get_file_type(file.filename or "")
    
    try:
        if file_type == 'csv':
            data = await parse_csv_file(file)
        elif file_type in ['xlsx', 'xls']:
            data = await parse_excel_file(file)
        elif file_type == 'pdf':
            data = await parse_pdf_file(file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Map columns to expected format
        processed = []
        for row in data:
            product = {
                "name": row.get("name") or row.get("Name") or row.get("product_name") or "",
                "category": row.get("category") or row.get("Category") or "",
                "mrp": float(row.get("mrp") or row.get("MRP") or row.get("price") or row.get("Price") or 0),
                "cost": float(row.get("cost") or row.get("Cost") or 0),
                "stock": int(row.get("stock") or row.get("Stock") or row.get("quantity") or row.get("Quantity") or 0),
                "sku": row.get("sku") or row.get("SKU") or "",
                "description": row.get("description") or row.get("Description") or "",
            }
            # Include row if it has at least a name (for preview purposes)
            if product["name"]:
                processed.append(product)
        
        return {"success": True, "data": processed}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@router.post("/preview-bills")
async def preview_bills_import(
    file: UploadFile = File(...)
):
    """Preview bill data from file before import"""
    file_type = get_file_type(file.filename or "")
    
    try:
        if file_type == 'csv':
            data = await parse_csv_file(file)
        elif file_type in ['xlsx', 'xls']:
            data = await parse_excel_file(file)
        elif file_type == 'pdf':
            data = await parse_pdf_file(file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Map columns to expected format
        processed = []
        for row in data:
            bill = {
                "customer_id": row.get("customer_id") or row.get("Customer ID") or row.get("customer_name") or "",
                "items": row.get("items") or row.get("Items") or [],
                "total_amount": float(row.get("total_amount") or row.get("Total Amount") or row.get("total") or row.get("Total") or 0),
                "notes": row.get("notes") or row.get("Notes") or "",
            }
            # Include row if it has at least a customer_id and positive total (for preview purposes)
            if bill["customer_id"] and bill["total_amount"] >= 0:
                processed.append(bill)
        
        return {"success": True, "data": processed}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

# Bulk import endpoints
@router.post("/customers")
async def bulk_import_customers(
    request: CustomerImportRequest,
    current_user: CurrentUser,
    db: Database
):
    """Bulk import customers"""
    try:
        imported = []
        errors = []
        user_id = current_user["user_id"]
        
        for idx, customer_data in enumerate(request.customers):
            try:
                customer = await create_customer(
                    CustomerCreate(
                        name=customer_data.get("name", ""),
                        phone=customer_data.get("phone", ""),
                        address=customer_data.get("address", ""),
                        initial_udhaar=float(customer_data.get("initial_udhaar") or customer_data.get("total_udhaar", 0)),
                    ),
                    user_id,
                    db
                )
                imported.append(customer)
            except Exception as e:
                errors.append({"row": idx + 1, "error": str(e)})
        
        return {
            "success": True,
            "imported": len(imported),
            "errors": errors,
            "data": imported
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@router.post("/products")
async def bulk_import_products(
    request: ProductImportRequest,
    current_user: CurrentUser,
    db: Database
):
    """Bulk import products"""
    try:
        imported = []
        errors = []
        user_id = current_user["user_id"]
        
        for idx, product_data in enumerate(request.products):
            try:
                # Create ProductCreate object with proper field mappings
                product = await create_product(
                    ProductCreate(
                        name=product_data.get("name", ""),
                        sku=product_data.get("sku", ""),
                        mrp=float(product_data.get("mrp") or product_data.get("price", 0)),
                        cost=float(product_data.get("cost", 0)),
                        stock=int(product_data.get("stock") or product_data.get("quantity", 0)),
                        category=product_data.get("category", ""),
                        description=product_data.get("description", ""),
                    ),
                    user_id,
                    db
                )
                imported.append(product)
                    
            except Exception as e:
                errors.append({"row": idx + 1, "error": str(e)})
        
        return {
            "success": True,
            "imported": len(imported),
            "errors": errors,
            "data": imported
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@router.post("/bills")
async def bulk_import_bills(
    request: BillImportRequest,
    current_user: CurrentUser,
    db: Database
):
    """Bulk import bills"""
    try:
        imported = []
        errors = []
        user_id = current_user["user_id"]
        
        for idx, bill_data in enumerate(request.bills):
            try:
                bill = {
                    "customer_id": bill_data.get("customer_id", ""),
                    "items": bill_data.get("items", []),
                    "total_amount": float(bill_data.get("total_amount", 0)),
                    "notes": bill_data.get("notes", ""),
                    "owner_id": user_id,
                }
                
                result = await db["bills"].insert_one(bill)
                bill["_id"] = result.inserted_id
                imported.append(bill)
                
            except Exception as e:
                errors.append({"row": idx + 1, "error": str(e)})
        
        return {
            "success": True,
            "imported": len(imported),
            "errors": errors,
            "data": imported
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
