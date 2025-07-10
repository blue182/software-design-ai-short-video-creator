from app.schemas.script_schema import  FullScriptRequest
from app.utils.gemini import call_gemini
from app.prompts.script_prompts import build_prompt_full_script

async def generate_full_script(request: FullScriptRequest):
    """
    Generate a full script based on the provided request data.
    """
    try:
        prompt = build_prompt_full_script(request)
        data = call_gemini(prompt)

        full_script = data.get("full_script", [])
        for segment in full_script:
            if "text" in segment:
                segment["audio_text"] = segment["text"]

        return {           
            "topic": request.topic,
            "title": request.title or data.get("title", ""),
            "full_script": full_script,
            "duration_seconds": request.duration,
            "language": request.language,
            "voice": request.voice,            
        }

    except Exception as e:
        print("Error generating full script:", str(e))
        raise RuntimeError(f"Gemini error: {str(e)}")