from pydantic import BaseModel, Field
from typing import List


class VideoSegment(BaseModel):
    id: int
    segment_index: int
    text: str
    audio_text: str = None
    start_time: float
    end_time: float
    duration: float
    description_image: str
    audio_url: str
    image_url: str
    preview_url: str = None


class VideoScriptResponse(BaseModel):
    id_cloud: str
    topic: dict
    style: dict
    duration: dict
    language: dict
    voice: dict
    title: str = None
    segments: List[VideoSegment]
    video_url: str = None
