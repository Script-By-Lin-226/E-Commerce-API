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



@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(order_and_payment_route.router)
app.include_router(auth_route.router)
app.include_router(product_management_route.router)
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(TokenRotationMiddleware)
app.add_middleware(LoggingMiddleware)

# CORS middleware MUST be last
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://e-commerce-api-test-seven.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)