from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.services.jwt_service import decode_token, create_access_token, create_refresh_token
from app.config.config import settings

EXCLUDE_PATHS = {
    "/auth/login", "/auth/register", "/openapi.json", "/docs", "/redoc", "/auth/logout", "/", "/order/", "/payments" , "https://e-commerce-api-b9zy.onrender.com/auth/login"
}

class TokenRotationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        # 1. Let OPTIONS pass through to CORSMiddleware
        if request.method == "OPTIONS":
            return await call_next(request)

        # 2. Skip exclusions
        if request.url.path in EXCLUDE_PATHS:
            return await call_next(request)

        access_token = request.cookies.get("access_token")
        refresh_token = request.cookies.get("refresh_token")
        user_id = None
        new_access_token = None
        new_refresh_token = None

        # Parse access token
        if access_token:
            try:
                payload = decode_token(access_token)
                user_id = payload.get("sub")
            except:
                user_id = None

        # Use refresh token if access token invalid/missing
        if not user_id and refresh_token:
            try:
                payload = decode_token(refresh_token)
                token_type = payload.get("type")
                user_id = payload.get("sub")
                
                # Validate that it's a refresh token
                if token_type != "refresh":
                    return JSONResponse(status_code=401, content={"detail": "Invalid token type"})
                
                if not user_id:
                    return JSONResponse(status_code=401, content={"detail": "Invalid refresh token"})

                # Rotate tokens (stateless - no server-side storage needed)
                new_access_token = create_access_token({"sub": user_id})
                new_refresh_token = create_refresh_token({"sub": user_id})
            except Exception:
                return JSONResponse(status_code=401, content={"detail": "Refresh token invalid or expired"})

        request.state.user_id = user_id
        response = await call_next(request)

        # 3. Set cookies on the response object safely
        if new_refresh_token and new_access_token:
            response.set_cookie(
                "refresh_token",
                new_refresh_token,
                secure=True,
                httponly=True,
                samesite="none",
                max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
            )
            response.set_cookie(
                "access_token",
                new_access_token,
                secure=True,
                httponly=True,
                samesite="none",
                max_age=30 * 60
            )
            response.headers["X-New-Access-Token"] = new_access_token

        return response