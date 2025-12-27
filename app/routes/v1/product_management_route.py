from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.dependency import get_async_session, role_required
from app.schemas.product_schemas import ProductResponse, AddProductSchema
from app.services.product_management_service import add_product, update_product, delete_product , get_all_products , search_products
from fastapi import APIRouter , Depends,HTTPException,status, Request

router = APIRouter(prefix="/product",tags=["product"])

@router.post("/",response_model=ProductResponse)
async def create_product_route(product:AddProductSchema, session = Depends(get_async_session),  role = Depends(role_required("admin", "sale" , "hr"))):
    return await add_product(product, session)

@router.get("/search")
async def search_product_route(product_id: Optional[int] = None,
    name: Optional[str] = None,
    description: Optional[str] = None,
    stock: Optional[int] = None,price: Optional[int] = None, session = Depends(get_async_session)):
    return await search_products(session, product_id, name, description, price, stock)

@router.get("/")
async def get_all_products_route(session: AsyncSession = Depends(get_async_session)):
    return await get_all_products(session)

@router.patch("/{product_id}")
async def update_product_route(product_id: int, product_name:Optional[str] = None, product_description:Optional[str] = None, product_price:Optional[int] = None, stock:Optional[int] = None, product_image_url:Optional[str] = None, session = Depends(get_async_session)):
    return await update_product(product_id, product_name, product_description, product_price, stock, session, product_image_url)

@router.delete("/{product_id}")
async def delete_product_route(product_id: int ,session = Depends(get_async_session), role = Depends(role_required("admin", "sale" , "hr"))):
    return await delete_product(product_id, session)