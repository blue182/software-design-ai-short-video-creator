from pydantic import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    BASE_MEDIA_PATH: str = "media/"

    class Config:
        env_file = ".env"

settings = Settings()
