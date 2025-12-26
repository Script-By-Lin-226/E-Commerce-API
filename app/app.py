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

# CORS middleware MUST be added FIRST (executes LAST in FastAPI)
# FastAPI executes middlewares in REVERSE order of addition
# So CORS needs to be first to execute last and add headers to all responses
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://e-commerce-api-test-seven.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.(vercel\.app|onrender\.com|ngrok-free\.app|ngrok\.io)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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