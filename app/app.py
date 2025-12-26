from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.dependency import init_db , get_async_session
from app.middleware.TokenRotationMiddleware import TokenRotationMiddleware
from app.middleware.AuthMiddleware import AuthenticationMiddleware
from app.routes.v1 import auth_route , product_management_route , order_and_payment_route
from app.middleware.Logging_middleware import LoggingMiddleware


@asynccontextmanager
async def life_cycle(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="E-Commerce API" , lifespan=life_cycle)

# Add CORS middleware - MUST be added first (executes last in FastAPI)
# FastAPI executes middlewares in reverse order of addition

# CORS origins - includes localhost, ngrok patterns, and Vercel
# For ngrok free tier, URLs change on each restart, so we allow common patterns
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    # Vercel frontend URL
    "https://e-commerce-api-test-seven.vercel.app",
    # Render backend URLs (for API-to-API calls if needed)
    "https://e-commerce-api-1nn0.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    # Use regex to allow dynamic origins (ngrok, Vercel, Render, etc.)
    allow_origin_regex=r"https://.*\.(ngrok-free\.app|ngrok\.io|ngrok\.app|loca\.lt|vercel\.app|netlify\.app|railway\.app|render\.com|onrender\.com)",
    # Also allow specific localhost and production origins
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(order_and_payment_route.router)
app.include_router(auth_route.router)
app.include_router(product_management_route.router)
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(TokenRotationMiddleware)
app.add_middleware(LoggingMiddleware)