from starlette.responses import JSONResponse

from app.models.DataTable import UserTable
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import HTTPException, Request
from sqlalchemy.future import select
from starlette import status
from app.core.db_init import async_session
from app.services.jwt_service import decode_token

_EXCLUDE_PATHS = {
    "/auth/login", "/auth/register", "/openapi.json", "/docs", "/redoc", "/",
    "/product/", "/product/search"  # Make product viewing public
}

class AuthenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow OPTIONS requests to pass through (for CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # Check if path is in exclude list (handle with/without trailing slash)
        path = request.url.path.rstrip('/')
        if request.url.path in _EXCLUDE_PATHS or path in _EXCLUDE_PATHS:
            return await call_next(request)
        
        # Allow GET requests to product endpoints (viewing products should be public)
        if request.method == "GET" and (request.url.path.startswith('/product/') or request.url.path == '/product'):
            return await call_next(request)

        access_token = request.cookies.get("access_token")
        if not access_token:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "You are not logged in"})

        try:
            payload = decode_token(access_token)
            user_id = payload.get("sub")
            token_type = payload.get("type")
            if token_type != "access":
                return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "Token Type must be 'access'"})
            if not user_id:
                return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detail": "User not found"})
        except Exception:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "Invalid token"})

        async with async_session() as db:
            result = await db.execute(select(UserTable).where(UserTable.id == int(user_id)))
            user = result.scalar_one_or_none()
            if not user:
                return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": "User not found"})

        request.state.user = user
        return await call_next(request)