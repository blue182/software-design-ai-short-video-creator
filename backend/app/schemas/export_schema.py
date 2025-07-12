from typing import List, Optional
from pydantic import BaseModel


class ExportRequest(BaseModel):
    id_cloud: str
    segments: List[dict]  # List of segments with their properties
    video_size: dict = { } 


class ExportResponse(BaseModel):
    id_cloud: str
    video_url: str
