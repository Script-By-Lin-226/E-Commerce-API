import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Import your Base and all models here
from app.core.db_init import Base
from app.models.DataTable import *

# -----------------------------
# Alembic Config
# -----------------------------
config = context.config

# Set up Python logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for 'autogenerate'
target_metadata = Base.metadata

# -----------------------------
# Offline Migrations
# -----------------------------
def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    No DBAPI connection required.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# -----------------------------
# Online Migrations Helper
# -----------------------------
def do_run_migrations(connection: Connection) -> None:
    """
    Run migrations using a connection.
    This will be used in async engine with run_sync().
    """
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )

    with context.begin_transaction():
        context.run_migrations()

# -----------------------------
# Online Migrations (Async)
# -----------------------------
async def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode with AsyncEngine.
    """
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        # Alembic is synchronous; run inside run_sync
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

# -----------------------------
# Run Migrations (Entry Point)
# -----------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())