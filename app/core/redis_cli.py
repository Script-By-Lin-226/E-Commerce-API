import os
from redis.asyncio import Redis

# Create a Redis client with environment variable support
# For Render, you can use Redis addon or set REDIS_URL
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", "6379"))
redis_url = os.getenv("REDIS_URL")

if redis_url:
    # Use Redis URL if provided (for cloud Redis services)
    redis_client = Redis.from_url(redis_url, decode_responses=True)
else:
    # Fallback to host/port configuration
    redis_client = Redis(
        host=redis_host,
        port=redis_port,
        decode_responses=True
    )