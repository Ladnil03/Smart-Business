from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache
import json
import os


class Settings(BaseSettings):
    mongodb_url: str = ""
    db_name: str = "vyaparseth"
    secret_key: str = "dev-secret-key-change-in-production-12345678"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    groq_api_key: str = ""
    groq_model: str = "llama3-8b-8192"
    shop_name: str = "MyShop"
    cors_origins: str = '["http://localhost:5173","http://localhost:3000","https://smart-business-526t.vercel.app"]'
    environment: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )

    @field_validator("secret_key")
    @classmethod
    def check_secret_length(cls, v: str) -> str:
        # In production, enforce strong keys
        if os.getenv("ENVIRONMENT") == "production":
            if len(v) < 32:
                raise ValueError("SECRET_KEY must be at least 32 characters for production security")
        return v

    @field_validator("mongodb_url")
    @classmethod
    def check_mongodb_url(cls, v: str) -> str:
        if os.getenv("ENVIRONMENT") == "production" and not v:
            raise ValueError("MONGODB_URL is required in production")
        return v

    @field_validator("groq_api_key")
    @classmethod
    def check_groq_key(cls, v: str) -> str:
        if os.getenv("ENVIRONMENT") == "production" and not v:
            raise ValueError("GROQ_API_KEY is required in production")
        return v

    def get_cors_origins(self) -> list[str]:
        """Parse CORS_ORIGINS as JSON string to list"""
        try:
            return json.loads(self.cors_origins)
        except (json.JSONDecodeError, TypeError):
            # In production, fail hard if CORS parsing fails
            if self.environment == "production":
                raise RuntimeError("CORS_ORIGINS must be valid JSON in production")
            # Fallback to defaults only for non-production
            return ["http://localhost:5173", "http://localhost:3000"]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
