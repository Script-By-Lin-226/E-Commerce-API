from typing import List, Optional

from fastapi import HTTPException, Request, Depends
from sqlalchemy import func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette import status
from fastapi.responses import JSONResponse
from app.models.DataTable import ProductTable
from app.core.dependency import role_required, get_current_user
from app.schemas.product_schemas import AddProductSchema, ProductResponse


async def add_product(new_prod: AddProductSchema, session:AsyncSession) -> ProductResponse:
    # Handle auto-generated ID if not provided
    product_id = new_prod.id
    if product_id is None:
        # Get the maximum ID and increment by 1
        max_id_query = select(func.max(ProductTable.id))
        max_result = await session.execute(max_id_query)
        max_id = max_result.scalar()
        product_id = (max_id or 0) + 1
    else:
        # Check if product with this ID already exists
        q = select(ProductTable).where(ProductTable.id == product_id)
        result = await session.execute(q)
        product = result.scalars().first()
        if product:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product already exists")

    # Check if product name already exists
    name_check = select(ProductTable).where(ProductTable.name == new_prod.name)
    name_result = await session.execute(name_check)
    existing_product = name_result.scalars().first()
    if existing_product:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product name already exists")

    new_product = ProductTable(
        id=product_id,
        name=new_prod.name,
        description=new_prod.description,
        price=new_prod.price,
        stock=new_prod.stock,
        image_url=new_prod.image_url,
    )
    session.add(new_product)
    await session.commit()
    await session.refresh(new_product)
    return ProductResponse(
        id=new_product.id, 
        name=new_product.name, 
        description=new_product.description, 
        price=new_product.price, 
        stock=new_product.stock,
        image_url=new_product.image_url
    )

async def get_all_products(session:AsyncSession):
    q = select(ProductTable).order_by(ProductTable.id)
    result = await session.execute(q)
    products = result.scalars().all()
    # Return empty list instead of raising error when no products
    return products if products else []

async def update_product(product_id:int, product_name:Optional[str], product_description:Optional[str], product_price:Optional[int], product_stock:Optional[int], session:AsyncSession, product_image_url:Optional[str] = None) -> JSONResponse:
    q = select(ProductTable).where(ProductTable.id == product_id)
    result = await session.execute(q)
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if product_name:
        product.name = product_name

    if product_description:
        product.description = product_description

    if product_price:
        product.price = product_price

    if product_stock:
        product.stock = product_stock

    if product_image_url is not None:
        product.image_url = product_image_url

    await session.commit()
    await session.refresh(product)
    return JSONResponse(status_code=status.HTTP_200_OK, content=f"ID {product.id}: updated successfully")

async def delete_product(product_id: int, session: AsyncSession):
    result = await session.execute(
        select(ProductTable).where(ProductTable.id == product_id)
    )
    product = result.scalars().first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    product.is_active = False
    await session.commit()

    return {"detail": f"Product ID {product_id} disabled successfully"}

async def search_products(
    session: AsyncSession,
    product_id: Optional[int] = None,
    name: Optional[str] = None,
    description: Optional[str] = None,
    price: Optional[int] = None,
    stock: Optional[int] = None
):
    """
    Search products by product_id, name, description, or stock.
    Returns a list of matching products.
    """
    query = select(ProductTable)

    if product_id is not None:
        query = query.where(ProductTable.id == product_id)
    if name is not None:
        query = query.where(func.lower(ProductTable.name) == name.lower())
    if description is not None:
        query = query.where(func.lower(ProductTable.description) == description.lower())
    if price is not None:
        query = query.where(ProductTable.price <= price)

    if stock is not None:
        query = query.where(ProductTable.stock <= stock)

    result = await session.execute(query)
    products = result.scalars().all()

    # Return empty list instead of raising error when no products found
    return products if products else []