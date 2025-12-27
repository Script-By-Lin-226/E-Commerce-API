from fastapi import Request, status
from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse
from sqlalchemy.orm import selectinload
from app.models.DataTable import ProductTable, UserTable , OrderTable , OrdersItemTable, PaymentTable
from app.schemas.order_schemas import OrderCreateSchema
from sqlalchemy.future import select
from app.schemas.paymentt_shcemas import Payment

async def create_order(request:Request,order_create:OrderCreateSchema ,session: AsyncSession):
    user = getattr(request.state, "user", None)
    if not user:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "Authentication required. Please login to create an order."}
        )

    new_order = OrderTable(user_id = user.id)
    session.add(new_order)
    await session.flush()

    for item in order_create.items:
        q = select(ProductTable).where(ProductTable.id == item.product_id)
        res = await session.execute(q)
        product = res.scalars().first()
        if not product:
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,content={"message":"Product not found"})

        if not product.is_active:
            return JSONResponse(
                content={"message": "Product is not active"},
            )

        if product.stock < item.quantity:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": f"Product '{product.name}' is out of stock! Available: {product.stock}, Requested: {item.quantity}"}
            )

        product.stock -= item.quantity
        total_price = product.price * item.quantity

        order_item = OrdersItemTable(
            order_id = new_order.id,
            product_id = product.id,
            quantity = item.quantity,
            total_price = total_price,
        )

        session.add(order_item)
        await session.flush()

    await session.commit()
    await session.refresh(new_order)

    return JSONResponse(status_code=status.HTTP_201_CREATED,content={"Order ID":new_order.id, "Message":"Order created"})

async def get_order(
    order_id: int,
    session: AsyncSession
):
    query = (
        select(OrderTable)
        .where(OrderTable.id == order_id)
        .options(
            selectinload(OrderTable.items)
            .selectinload(OrdersItemTable.product)
        )
    )

    result = await session.execute(query)
    order = result.scalar_one_or_none()

    if not order:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,content={"message":"Order not found"})


    total = sum(item.total_price for item in order.items)

    return {
        "order_id": order.id,
        "status": order.status,
        "created_at": order.created_at.isoformat(),
        "Total Price": total,
        "items": [
            {
                "product_id": item.product.id,
                "product_name": item.product.name,
                "price": item.product.price,
                "quantity": item.quantity,
                "Total_price": item.total_price,
            }
            for item in order.items
        ],

    }

async def get_all_orders(request:Request ,session: AsyncSession):
    query = (
        select(OrderTable)
        .options(
            selectinload(OrderTable.items)
            .selectinload(OrdersItemTable.product)
        )
    )
    user = getattr(request.state, 'user', None)
    result = await session.execute(query)
    orders = result.scalars().all()  # list of OrderTable objects

    if not orders:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "No orders found"}
        )

    # Prepare response
    response = []
    for order in orders:
        if order.user_id != user.id:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "User does not have permission to perform this action"}
            )
        else:
            response.append({
                "order_id": order.id,
                "status": order.status,
                "Total Price": sum(item.total_price for item in order.items),
                "created_at": order.created_at.isoformat(),
                "items": [
                    {
                        "product_id": item.product.id,
                        "product_name": item.product.name,
                        "price": item.product.price,
                        "quantity": item.quantity,
                        "total_price": item.quantity * item.product.price,  # calculate per item
                    }
                    for item in order.items
                ]
            })


    return {
        "Orders": response
    }

async def payment_process(request:Request,pay:Payment, session: AsyncSession):
    if pay.paid_amount <= 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Paid amount must be greater than 0"}
        )
    user = getattr(request.state, 'user', None)
    if not user:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "Authentication required. Please login to process payment."}
        )
    # Get all unpaid payments (optional: filter by order_id)
    query = (
        select(OrderTable).where(OrderTable.id == pay.order_id).options(
            selectinload(OrderTable.items)
        )
    )
    res = await session.execute(query)
    order = res.scalar_one_or_none()
    if not order:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Order not found"}
        )
    if order.status == "paid":
        return JSONResponse(
            content={"message": "Order already paid"},
        )

    total = float(sum(item.total_price for item in order.items))
    paid_amount_float = float(pay.paid_amount)
    
    # Allow payment if amount matches or is greater (for cash payments with change)
    if paid_amount_float < total:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": f"Paid amount (${paid_amount_float:.2f}) is less than total amount (${total:.2f})"}
        )

    # Mark order as paid if payment amount is sufficient
    if paid_amount_float >= total:
        order.status = "paid"

    new_payment = PaymentTable(
        user_id = user.id,
        order_id = order.id,
        pay_amount = paid_amount_float,
    )
    session.add(new_payment)
    await session.commit()
    await session.refresh(new_payment)
    
    payment_method_display = pay.payment_method.upper() if hasattr(pay, 'payment_method') else 'CASH'
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "message": "Payment processed successfully!",
            "order_id": order.id,
            "payment_method": payment_method_display,
            "paid_amount": float(paid_amount_float)
        }
    )

