from fastapi import APIRouter, HTTPException
from ..schemas.script_schema import FullScriptRequest
import uuid
import time
from ..schemas.video_schema import VideoScriptResponse, VideoSegment
from ..services.script.full_script_generator import generate_full_script
from ..services.audio.generator import generate_audio_segments
from ..services.image.image_generator import generate_and_upload_images
from ..services.video.video_renderer import generate_video_from_segments
from ..services.audio.background_music import get_music_url_by_style
from ..services.video.clip_generator import create_clip_from_segment

router = APIRouter()

def generate_render_id():
    short_uuid = uuid.uuid4().hex[:6]  
    timestamp = int(time.time())     
    return f"vid_{short_uuid}_{timestamp}"

@router.post("/", response_model=dict)
async def generate_video(request: FullScriptRequest):
   
    render_id = generate_render_id()
    script = await generate_full_script(request)
    segments = script.get("full_script", [])

    for segment in segments:
        print(f"Segment {segment['segment_index']}: {segment['text']}, duration: {segment['duration']}, ")

    segments_with_audio = await generate_audio_segments(segments, request.voice.get('code') , render_id)
    print("\n\nSegments with audio:")

    print("\n\nImage generation started...")
    segments_with_images = await generate_and_upload_images(segments_with_audio, render_id)
    print("\n\nSegments with images:")


    # Add background music if style is provided
    music_url = get_music_url_by_style(request.style.get('style'), render_id)
    print("\n\nBackground music URL:", music_url)

    video_script_response = VideoScriptResponse(
        id_cloud=render_id,
        topic=request.topic,
        style=request.style,
        duration=request.duration,
        language=request.language,
        voice=request.voice,
        title=request.title,
        segments=[
            VideoSegment(
                id=segment['id'],
                segment_index=segment['segment_index'],
                text=segment['text'],
                start_time=segment['start_time'],
                end_time=segment['end_time'],
                duration=segment['duration'],
                description_image=segment['description_image'],
                audio_url=segment['audio_url'],
                image_url=segment['image_url'],
               
            ) for segment in segments_with_images
        ],
        # video_url=url_video
    )


    try:
        # Here you would call your video generation logic
        # For now, we return a mock response
        response = {
            "code": 200,
            "message": "Video generated successfully",
            "data": video_script_response.model_dump(),
        }
        return response
    except Exception as e:
        print("Error generating video:", str(e))
        raise HTTPException(status_code=500, detail=f"Video generation error: {str(e)}")