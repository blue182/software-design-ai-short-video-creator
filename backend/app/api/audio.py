# app/api/audio.py
from fastapi import APIRouter, UploadFile, Form
from app.services.audio.trim_and_save import trim_and_upload_audio
from app.services.audio.generator import _generate_and_upload_segment
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/trim")
async def api_trim_audio(
    file: UploadFile,
    start: float = Form(...),
    end: float = Form(...),
    id_cloud: str = Form(...)
):
    url = await trim_and_upload_audio(file, start, end, id_cloud)
    return { "success": True, "url": url }

@router.post("/generate")
async def api_generate_audio(
            audio_text: str = Form(...),
            voice: str = Form(...),
            index: int = Form(...),
            folder: str = Form(...),
            duration: float = Form(...),
        ):
    try:
        segment_result = await _generate_and_upload_segment(
            text=audio_text,
            voice=voice,
            index=index,
            folder=folder,
            target_duration=duration
        )
        print(f"Generated audio segment: {segment_result}")
        return JSONResponse(content={"success": True, "audio_segment": segment_result})

    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})