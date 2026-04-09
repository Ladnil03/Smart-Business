from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import StreamingResponse
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from bson import ObjectId

from backend.schemas.bill import BillCreate
from backend.services import bill_service
from backend.utils.dependencies import CurrentUser, Database, CurrentUserDownload

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_bill(
    payload: BillCreate, user: CurrentUser, db: Database
) -> dict:
    result = await bill_service.create_bill(payload, user["user_id"], db)
    if isinstance(result, str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result)
    return {"success": True, "message": "Bill created.", "data": result}


@router.get("", status_code=status.HTTP_200_OK)
async def get_bills(
    user: CurrentUser,
    db: Database,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200)
) -> dict:
    skip = (page - 1) * limit
    data = await bill_service.list_bills(user["user_id"], db, skip, limit)
    return {"success": True, "message": "Bills fetched.", "data": data}


@router.get("/customer/{customer_id}", status_code=status.HTTP_200_OK)
async def get_bills_for_customer(
    customer_id: str, user: CurrentUser, db: Database
) -> dict:
    cursor = db.bills.find({"customer_id": customer_id, "owner_id": user["user_id"]}).sort("created_at", -1)
    from backend.utils.serializers import serialize_doc
    bills = [serialize_doc(b, id_alias="bill_id") async for b in cursor]
    return {"success": True, "message": "Bills fetched.", "data": bills}


@router.get("/{bill_id}/pdf", status_code=status.HTTP_200_OK)
async def download_bill_pdf(
    bill_id: str, user: CurrentUserDownload, db: Database
):
    bill = await bill_service.get_bill_by_id(bill_id, user["user_id"], db)
    if bill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    
    # Fetch customer name if available
    customer_name = "Walk-in Customer"
    if bill.get("customer_id"):
        try:
            cust_oid = ObjectId(bill.get("customer_id"))
            customer = await db.customers.find_one({"_id": cust_oid, "owner_id": user["user_id"]})
            if customer:
                customer_name = customer.get("name", "Walk-in Customer")
        except Exception:
            pass
    
    # Fetch owner's shop name
    try:
        owner_oid = ObjectId(user["user_id"])
        owner = await db.users.find_one({"_id": owner_oid})
        shop_name = owner.get("shop_name", "Our Store") if owner else "Our Store"
    except Exception:
        shop_name = "Our Store"
    
    # Generate PDF
    pdf_buffer = io.BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.black,
        spaceAfter=6,
    )
    
    elements = []
    
    # Header
    header_data = [[shop_name, "INVOICE"]]
    header_table = Table(header_data, colWidths=[3*inch, 3*inch])
    header_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (0, 0), 16),
        ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (1, 0), (1, 0), 14),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 0.1*inch))
    
    # Bill details
    bill_id_short = bill_id[-8:] if len(bill_id) >= 8 else bill_id
    bill_date = bill.get("created_at")
    if isinstance(bill_date, str):
        bill_date_str = bill_date[:10]
    elif bill_date:
        bill_date_str = bill_date.strftime("%Y-%m-%d")
    else:
        bill_date_str = datetime.utcnow().strftime("%Y-%m-%d")
    
    details = [
        [f"Bill #: {bill_id_short}", f"Date: {bill_date_str}"],
    ]
    details_table = Table(details, colWidths=[3*inch, 3*inch])
    details_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
    ]))
    elements.append(details_table)
    elements.append(Spacer(1, 0.1*inch))
    
    # Customer
    elements.append(Paragraph(f"<b>Customer:</b> {customer_name}", styles['Normal']))
    elements.append(Spacer(1, 0.1*inch))
    
    # Items table
    items_data = [["Item", "Qty", "Price", "Total"]]
    for item in bill.get("items", []):
        items_data.append([
            item.get("name", ""),
            str(item.get("qty", "")),
            f"₹{item.get('price', 0):.2f}",
            f"₹{item.get('qty', 0) * item.get('price', 0):.2f}",
        ])
    
    items_table = Table(items_data, colWidths=[2.5*inch, 1*inch, 1*inch, 1.5*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Total
    total_amount = bill.get("total", 0)
    total_data = [["TOTAL:", f"₹{total_amount:,.2f}"]]
    total_table = Table(total_data, colWidths=[5.5*inch, 1.5*inch])
    total_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'RIGHT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(total_table)
    elements.append(Spacer(1, 0.1*inch))
    
    # Status
    status_text = "PAID" if bill.get("paid") else "UNPAID"
    elements.append(Paragraph(f"<b>Status:</b> {status_text}", styles['Normal']))
    elements.append(Spacer(1, 0.1*inch))
    
    # Footer
    elements.append(Paragraph("Thank you for your business!", styles['Normal']))
    
    doc.build(elements)
    pdf_buffer.seek(0)
    
    return StreamingResponse(
        iter([pdf_buffer.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=bill_{bill_id_short}.pdf"}
    )
