from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.core.dependency import init_db
from app.middleware.TokenRotationMiddleware import TokenRotationMiddleware
from app.middleware.AuthMiddleware import AuthenticationMiddleware
from app.routes.v1 import (
    auth_route,
    product_management_route,
    order_and_payment_route,
    upload_route
)
import os


@asynccontextmanager
async def life_cycle(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="E-Commerce API",
    lifespan=life_cycle
)

# ===============================
# STATIC FILES
# ===============================
images_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
if os.path.exists(images_dir):
    app.mount("/images", StaticFiles(directory=images_dir), name="images")


@app.get("/")
async def root():
    return {"message": "Hello World"}


# ===============================
# CUSTOM MIDDLEWARE (ONCE)
# ===============================
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(TokenRotationMiddleware)

# ===============================
# ROUTERS
# ===============================
app.include_router(auth_route.router)
app.include_router(product_management_route.router)
app.include_router(order_and_payment_route.router)
app.include_router(upload_route.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://e-commerce-api-front-end.onrender.com", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)