from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    BASE_MEDIA_PATH: str = "media/"
    PIXABAY_API_KEY: str
    DEFAULT_MUSIC_URL: str = "https://res.cloudinary.com/dszu0fyxg/video/upload/v1751654344/backgound_music_default_d6jhpl.mp3"  # URL nhạc mặc định nếu không tìm thấy
    TOGETHERAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
