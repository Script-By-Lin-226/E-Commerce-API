from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import  create_async_engine, async_sessionmaker, AsyncSession
from app.config.config import settings

engine = create_async_engine(settings.DATABASE_URL,echo=True)

async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()
