from redis.asyncio import Redis

# Create a Redis client
redis_client = Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)