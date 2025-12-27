from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.config.config import settings
import os
from urllib.parse import urlparse, urlunparse

# Convert postgresql:// to postgresql+asyncpg:// for async support
database_url = settings.DATABASE_URL or os.getenv("DATABASE_URL", "")

if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set. Please set it in Railway environment variables.")

# Handle different PostgreSQL URL formats
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)

# Parse URL to add SSL parameters if needed (for Railway/cloud databases)
parsed = urlparse(database_url)
connect_args = {}

if parsed.scheme.startswith("postgresql+asyncpg"):
    # Check if SSL is already configured in URL
    query_params = parsed.query
    has_ssl_in_url = "sslmode" in query_params or "ssl" in query_params
    
    # For asyncpg, SSL can be handled via connect_args or URL
    # Railway PostgreSQL typically requires SSL
    # Only add SSL if not already present in URL
    if not has_ssl_in_url:
        # Add sslmode to URL
        if query_params:
            query_params += "&sslmode=require"
        else:
            query_params = "sslmode=require"
        
        # Reconstruct URL with SSL parameter
        database_url = urlunparse((
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.params,
            query_params,
            parsed.fragment
        ))
        
        # Also set in connect_args for asyncpg
        connect_args = {
            "ssl": True,  # asyncpg uses boolean True for basic SSL
            "server_settings": {
                "application_name": "ecommerce_api"
            }
        }
    else:
        # SSL already in URL, just add server settings
        connect_args = {
            "server_settings": {
                "application_name": "ecommerce_api"
            }
        }

# Log database connection info (without password)
if database_url:
    safe_url = database_url.split('@')[-1] if '@' in database_url else database_url
    print(f"Database connection configured: {safe_url}")

# Configure engine with connection pool settings
engine = create_async_engine(
    database_url,
    echo=False,  # Set to False in production to reduce logs
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,   # Recycle connections after 1 hour
    connect_args=connect_args
)

async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()
