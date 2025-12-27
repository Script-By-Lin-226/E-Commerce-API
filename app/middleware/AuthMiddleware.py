from starlette.responses import JSONResponse, Response

from app.models.DataTable import UserTable
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import HTTPException, Request
from sqlalchemy.future import select
from starlette import status
from app.core.db_init import async_session
from app.services.jwt_service import decode_token

_EXCLUDE_PATHS = {
    "/auth/login", "/auth/register", "/openapi.json", "/docs", "/redoc" , "/",  "/orders" , "/payments"
}

class AuthenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 🔥 ALWAYS allow preflight
        if request.method == "OPTIONS":
            return await call_next(request)

        if request.url.path in _EXCLUDE_PATHS:
            return await call_next(request)

        access_token = request.cookies.get("access_token")
        if not access_token:
            response = JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "You are not logged in"})
            return response

        try:
            payload = decode_token(access_token)
            user_id = payload.get("sub")
            token_type = payload.get("type")
            if token_type != "access":
                response = JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "Token Type must be 'access'"})
                return response
            if not user_id:
                response = JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detail": "User not found"})
                return response
        except Exception:
            response = JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "Invalid token"})
            return response

        async with async_session() as db:
            result = await db.execute(select(UserTable).where(UserTable.id == int(user_id)))
            user = result.scalar_one_or_none()
            if not user:
                response = JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": "User not found"})
                return response

        request.state.user = user
        response = await call_next(request)
        return response