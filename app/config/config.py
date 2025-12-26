import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
# Load .enc file
load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINS: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINS", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")

settings = Settings()