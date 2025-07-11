from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import trends
from app.api import generate_script
from app.api import generate_video
from app.api import export_video
from app.api import generate_preview_video
from app.api import audio
import PIL
import PIL.Image

if not hasattr(PIL.Image, 'ANTIALIAS'):
    from PIL import Image
    Image.ANTIALIAS = Image.Resampling.LANCZOS


app = FastAPI(title="AI Short Video Creator API", version="1.0.0", description="API for creating short videos using AI technologies")           
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(trends.router, prefix="/api/trends", tags=["trends"])
app.include_router(generate_script.router, prefix="/api/script")
app.include_router(generate_video.router, prefix="/api/video", tags=["video"])
app.include_router(generate_preview_video.router, prefix="/api/preview-video", tags=["preview-video"])
app.include_router(export_video.router, prefix="/api/export-video", tags=["export-video"])
app.include_router(trends.router, prefix="/api/trends", tags=["Trends"])
app.include_router(audio.router, prefix="/api/audio", tags=["Audio"])

