from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependency import get_async_session
from app.schemas.order_schemas import OrderCreateSchema
from app.schemas.paymentt_shcemas import Payment
from app.services.order_management import create_order, get_order, get_all_orders, payment_process
from fastapi import APIRouter, Depends, HTTPException, Request

router = APIRouter(prefix="/order", tags=["Order and Payment"])

@router.post("/")
async def create_order_route(request:Request , order_create: OrderCreateSchema, session:AsyncSession = Depends(get_async_session)):
    return await create_order(request, order_create, session)

@router.get("/{order_id}")
async def get_orders_route(order_id:int , session:AsyncSession = Depends(get_async_session)):
    return await get_order(order_id ,session)

@router.get("/")
async def get_all_orders_route(request:Request ,session:AsyncSession = Depends(get_async_session)):
    return await get_all_orders(request,session)

@router.post("/pay")
async def payment_route(request:Request, pay:Payment ,session:AsyncSession = Depends(get_async_session)):
    return await payment_process(request,pay,session)
