from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache
import json
import os


class Settings(BaseSettings):
    mongodb_url: str
    db_name: str
    secret_key: str = "my-super-secret-key-change-this-in-production-12345"  # <-- Default key
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    groq_api_key: str
    groq_model: str = "llama3-8b-8192"
    shop_name: str = "MyShop"
    cors_origins: str = '["http://localhost:5173","http://localhost:3000"]'

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )

    def get_cors_origins(self) -> list[str]:
        """Parse CORS_ORIGINS as JSON string to list"""
        try:
            return json.loads(self.cors_origins)
        except (json.JSONDecodeError, TypeError):
            # Fallback to defaults if parsing fails
            return ["http://localhost:5173", "http://localhost:3000"]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
