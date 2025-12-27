from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from app.core.redis_cli import redis_client
from app.services.jwt_service import decode_token, create_access_token, create_refresh_token
from app.config.config import settings

EXCLUDE_PATHS = {
    "/auth/login", "/auth/register", "/openapi.json", "/docs", "/redoc", "/auth/logout" , "/",  "/order/" , "/payments"
}


class TokenRotationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        # 🔥 ALWAYS allow preflight
        if request.method == "OPTIONS":
            response = await call_next(request)
            # Add CORS headers to OPTIONS response
            origin = request.headers.get("origin")
            if origin:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Allow-Methods"] = "*"
                response.headers["Access-Control-Allow-Headers"] = "*"
            return response

        if request.url.path in EXCLUDE_PATHS:
            response = await call_next(request)
            # Add CORS headers
            origin = request.headers.get("origin")
            if origin:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
            return response

        access_header = request.cookies.get("access_token")
        refresh_token = request.cookies.get("refresh_token")
        user_id = None
        new_access_token = None
        new_refresh_token = None

        # Parse access token
        if access_header:
            try:
                payload = decode_token(access_header)
                user_id = payload.get("sub")
            except:
                user_id = None  # Let refresh token handle

        # Use refresh token if access token invalid/missing
        if not user_id and refresh_token:
            try:
                payload = decode_token(refresh_token)
                user_id = payload.get("sub")

                stored_token = await redis_client.get(f"refresh_token:{user_id}")

                if stored_token != refresh_token:
                    response = JSONResponse(status_code=401, content={"detail": "Refresh token invalid"})
                    # Add CORS headers
                    origin = request.headers.get("origin")
                    if origin:
                        response.headers["Access-Control-Allow-Origin"] = origin
                        response.headers["Access-Control-Allow-Credentials"] = "true"
                    return response

                # Rotate tokens
                new_access_token = create_access_token({"sub": user_id})
                new_refresh_token = create_refresh_token({"sub": user_id})
                await redis_client.set(
                    f"refresh_token:{user_id}",
                    new_refresh_token,
                    ex=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
                )
            except:
                response = JSONResponse(status_code=401, content={"detail": "Refresh token invalid"})
                # Add CORS headers
                origin = request.headers.get("origin")
                if origin:
                    response.headers["Access-Control-Allow-Origin"] = origin
                    response.headers["Access-Control-Allow-Credentials"] = "true"
                return response

        request.state.user_id = user_id
        response = await call_next(request)

        # Add CORS headers to all responses
        origin = request.headers.get("origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"

        if new_refresh_token and new_access_token:
            response.set_cookie(
                "refresh_token",
                new_refresh_token,
                secure=True,   # True for HTTPS (Render)
                httponly=True,
                samesite="none",  # Required for cross-origin
                max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
            )
            response.set_cookie(
                "access_token",
                new_access_token,
                secure=True,   # True for HTTPS (Render)
                httponly=True,
                samesite="none",  # Required for cross-origin
                max_age=30 * 60  # 30 minutes
            )
            response.headers["X-New-Access-Token"] = new_access_token

        return response