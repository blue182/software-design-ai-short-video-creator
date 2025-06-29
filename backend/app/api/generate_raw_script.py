
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os
from fastapi.responses import JSONResponse
import json

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_api_key)

# Create API router
router = APIRouter()

# Define the request model
class ScriptRequest(BaseModel):
    topic: dict
    style: dict
    duration: dict
    language: dict
    voice: dict

# Build prompt
def build_prompt(form: ScriptRequest) -> str:
    return f"""
        You are an API that only responds with raw JSON. Do not include Markdown formatting (like triple backticks) and do not explain anything.

        Respond in this JSON format:
        {{
        "title": "string",
        "narration": "string",
        "duration_seconds": number,
        "language": "string",
        "voice": "string"
        }}

        Now generate the short video script:

        - Topic: {form.topic.get('topic', 'No topic provided')}
        - Style: {form.style.get('style', 'default')}
        - Duration: {form.duration.get('value', '30')} seconds
        - Language: {form.language.get('languages', 'English')}
        - Voice: {form.voice.get('voice', 'Unknown')}

        Requirements:
        - The script should be engaging and match the style "{form.style.get('style', '')}".
        - Keep it within the estimated duration of {form.duration.get('value', '30')}s.
        - Use natural spoken language that is clear, appealing, and captivating.
        """.strip()

# Auto-select best model
def get_best_model_name() -> str:
    preferred_order = [
        "models/gemini-2.5-flash",
        "models/gemini-2.5-pro",
        "models/gemini-2.0-flash",
    ]
    available_models = [model.name for model in genai.list_models()]
    for model_name in preferred_order:
        if model_name in available_models:
            return model_name
    raise RuntimeError("No supported Gemini models available.")

# Route handler
@router.post("/")
async def generate_script(request: ScriptRequest):
    print("Received request:", request)
    prompt = build_prompt(request)


    try:
        model_name = get_best_model_name()
        print("Using model:", model_name)

        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)

        if not response or not response.text:
            raise ValueError("No script returned from Gemini.")

        try:
            data = json.loads(response.text)
        except json.JSONDecodeError:
            raise ValueError("AI response is not valid JSON. Expected a JSON string.")

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
