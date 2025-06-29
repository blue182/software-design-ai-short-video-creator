from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import trends
from app.api import generate_raw_script

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
app.include_router(generate_raw_script.router, prefix="/api/generate-raw-script")