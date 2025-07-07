from fastapi import APIRouter, HTTPException
from ..schemas.script_schema import FullScriptRequest
import uuid
import time
# from ..core.script_generator import generate_full_script
# from ..core.audio_generator import generate_audio_segments
# from ..core.image_generator import generate_and_upload_images
# from ..core.video_generator import generate_video_from_segments
from ..schemas.video_schema import VideoScriptResponse, VideoSegment


router = APIRouter()

def generate_render_id():
    short_uuid = uuid.uuid4().hex[:6]  
    timestamp = int(time.time())     
    return f"vid_{short_uuid}_{timestamp}"

@router.post("/", response_model=dict)
async def generate_video(request: FullScriptRequest):
    # print("request:", request)
    render_id = generate_render_id()

    try:
        # Here you would call your video generation logic
        # For now, we return a mock response
        response = {
            "code": 200,
            "message": "Video generated successfully",
            # "data": video_script_response.model_dump(),
        }
        return response
    except Exception as e:
        print("Error generating video:", str(e))
        raise HTTPException(status_code=500, detail=f"Video generation error: {str(e)}")