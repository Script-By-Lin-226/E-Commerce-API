from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from fastapi import Request


class CORSMiddlewareBackup(BaseHTTPMiddleware):
    """
    Backup CORS middleware to ensure CORS headers are always present.
    Note: In FastAPI, middleware runs in reverse order, so this runs AFTER CORSMiddleware.
    """
    async def dispatch(self, request: Request, call_next):
        # Process the request first
        response = await call_next(request)

        # Always add CORS headers (backup in case CORSMiddleware didn't)
        origin = request.headers.get("origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Expose-Headers"] = "*"
        else:
            # If no origin header, allow all (for same-origin requests)
            response.headers["Access-Control-Allow-Origin"] = "*"

        return response

