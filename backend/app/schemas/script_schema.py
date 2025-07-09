from pydantic import BaseModel

# Define the request model
class RawScriptRequest(BaseModel):
    topic: dict
    style: dict
    duration: dict
    language: dict
    voice: dict

class FullScriptRequest(BaseModel):
    topic: dict
    style: dict
    duration: dict
    language: dict
    voice: dict
    title: str = None
    script: str
    id_cloud: str = None
    video_size: dict = { } 