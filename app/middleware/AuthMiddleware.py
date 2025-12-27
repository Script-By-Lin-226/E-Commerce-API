from starlette.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from sqlalchemy.future import select
from starlette import status
from app.core.db_init import async_session
from app.services.jwt_service import decode_token
from app.models.DataTable import UserTable

_EXCLUDE_PATHS = {
    "/auth/login", "/auth/register", "/openapi.json", "/docs", "/redoc", "/", "/orders", "/payments" , 'https://e-commerce-api-b9zy.onrender.com/auth/login'
}


class AuthenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Let OPTIONS (Preflight) requests pass through.
        # CORSMiddleware will handle these headers at the outer layer.
        if request.method == "OPTIONS":
            return await call_next(request)

        # 2. Skip authentication for excluded paths
        if request.url.path in _EXCLUDE_PATHS:
            return await call_next(request)

        # 3. Extract access token from cookies
        access_token = request.cookies.get("access_token")
        if not access_token:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "You are not logged in"}
            )

        try:
            payload = decode_token(access_token)
            user_id = payload.get("sub")
            token_type = payload.get("type")

            if token_type != "access":
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Token Type must be 'access'"}
                )
            if not user_id:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "User ID missing in token"}
                )
        except Exception:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid or expired token"}
            )

        # 4. Database Validation
        async with async_session() as db:
            result = await db.execute(select(UserTable).where(UserTable.id == int(user_id)))
            user = result.scalar_one_or_none()
            if not user:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={"detail": "User no longer exists"}
                )

        request.state.user = user
        return await call_next(request)