from typing import AsyncGenerator
from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from app.core.db_init import async_session, engine, Base
from app.models.DataTable import UserTable
from sqlalchemy.future import select

from app.services.jwt_service import decode_token


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

async def get_current_user(request: Request, session:AsyncSession):
    access_token = request.cookies.get('access_token')
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    payload = decode_token(access_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user_id = payload.get('sub')
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user = await async_session.query(UserTable).filter(UserTable.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return user

def role_required(*roles):
    async def dependency(request: Request):
        user = getattr(request.state, 'user', None)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
        return user
    return dependency




