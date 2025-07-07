from fastapi import APIRouter, HTTPException
from ..schemas.script_schema import RawScriptRequest, FullScriptRequest
from ..prompts.script_prompts import build_prompt_raw_script, build_prompt_full_script
from ..utils.gemini import call_gemini
from fastapi.responses import JSONResponse

# Create API router
router = APIRouter()

# Route handler
@router.post("/raw-script", response_model=dict)
async def generate_raw_script(request: RawScriptRequest):
    try:
        prompt = build_prompt_raw_script(request)
        data = call_gemini(prompt)

        return JSONResponse(
            content={
                "topic": request.topic.get("topic", ""),
                "script": data.get("narration"),
                "title": data.get("title"),
            },
            status_code=200
        )

    except Exception as e:
        print("Error generating script:", str(e))
        raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")


@router.post("/full-script", response_model=dict)
async def generate_full_script(request: FullScriptRequest):
    try:
        prompt = build_prompt_full_script(request)
        data = call_gemini(prompt)

        return JSONResponse(
            content={
                "topic": request.topic,
                "title": request.title or data.get("title", ""),
                "full_script": data.get("full_script", []),
                "duration_seconds": request.duration,
                "language": request.language,
                "voice": request.voice,
            },
            status_code=200
        )

    except Exception as e:
        print("Error generating script:", str(e))
        raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")