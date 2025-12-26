from fastapi import HTTPException, status, Request
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse
from app.services.jwt_service import decode_token
from app.models.DataTable import UserTable
from app.security.password_hashed import hash_password, verify_password
from app.services.jwt_service import create_access_token, create_refresh_token
from app.core.redis_cli import redis_client
from app.schemas.user_schemas import UserRegister, UserLogin


# -------- REGISTER --------
async def register_user(user: UserRegister, session: AsyncSession):
    result = await session.execute(select(UserTable).where(UserTable.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = UserTable(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return {"message": "User created successfully"}

# -------- LOGIN --------
async def login_user(user:UserLogin, session: AsyncSession):
    result = await session.execute(select(UserTable).where(UserTable.email == user.email))
    db_user = result.scalar_one_or_none()

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token({"sub": str(db_user.id) , "type": "access"})
    refresh_token = create_refresh_token({"sub": str(db_user.id), "type": "refresh"})

    await redis_client.set(f"refresh_token:{db_user.id}", refresh_token, ex=7 * 24 * 3600)

    response = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"access_token": access_token, "token_type": "bearer"}
    )
    # Set cookies with proper settings for cross-origin
    response.set_cookie(
        "refresh_token", 
        refresh_token, 
        httponly=True, 
        samesite="lax", 
        max_age=7 * 24 * 3600,
        secure=False  # Set to False for localhost development
    )
    response.set_cookie(
        "access_token", 
        access_token, 
        httponly=True, 
        samesite="lax", 
        max_age=30 * 60,  # 30 minutes
        secure=False  # Set to False for localhost development
    )
    return response

# -------- LOGOUT --------
async def logout_user(request: Request):
    # Try to get user from state
    user = getattr(request.state, "user")
    user_id = user.id

    # Delete Redis token
    await redis_client.delete(f"refresh_token:{user_id}")

    # Clear cookies
    response = JSONResponse(status_code=200, content={"message": "Logged out successfully"})
    response.delete_cookie("refresh_token")
    response.delete_cookie("access_token")
    return response