from app.services.authentication_service import register_user , logout_user , login_user
from app.schemas.user_schemas import UserRegister, UserLogin
from fastapi import HTTPException, APIRouter, Depends, Request
from app.core.dependency import get_async_session
# Rate limiting disabled for local development
# from app.security.prevent_brutefore import limiter

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
# @limiter.limit("10 per day")  # Disabled for local development
async def register_user_route(user: UserRegister, request:Request, session = Depends(get_async_session)):
    return await register_user(user, session)

@router.post("/login")
async def login_user_route(user: UserLogin, session = Depends(get_async_session)):
    return await login_user(user, session)

@router.post("/logout")
async def logout_user_route(request:Request):
    return await logout_user(request)