from dotenv import load_dotenv
import google.generativeai as genai
import os
import json
import re

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_api_key)


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


def call_gemini(prompt: str):
    model_name = get_best_model_name()
    model = genai.GenerativeModel(model_name)
    response = model.generate_content(prompt)

    if not response or not response.text:
        raise ValueError("No script returned from Gemini.")

    raw = response.text.strip()

    # ✅ Tìm đoạn JSON đầu tiên trong response
    try:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if not match:
            raise ValueError("AI response does not contain a JSON object.")
        json_text = match.group()
        return json.loads(json_text)
    except json.JSONDecodeError:
        print("⚠️ Gemini raw response:\n", raw)
        raise ValueError("AI response is not valid JSON. Expected a JSON string.")