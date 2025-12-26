from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import  create_async_engine, async_sessionmaker, AsyncSession
from app.config.config import settings
import os

# Convert postgresql:// to postgresql+asyncpg:// for async support
database_url = settings.DATABASE_URL or os.getenv("DATABASE_URL", "")

if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set. Please set it in Render environment variables.")

if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(database_url, echo=True)

async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()
