from ..schemas.script_schema import RawScriptRequest, FullScriptRequest

def build_prompt_raw_script(form: RawScriptRequest) -> str:
    return f"""
        You are a strict API that responds **only** with **valid JSON** (no explanation, no markdown, no comments, no triple backticks, no additional text).

        Respond in this **exact** JSON format:

        {{
        "title": "string (required)",
        "narration": "string (required)",
        "duration_seconds": number (required, {form.duration.get('value', '30')} max),
        "language": "string (required, like 'Vietnamese (Vietnam)')",
        "voice": "string (required, like 'Nam Minh')"
        }}

        Based on the following input, generate a script:

        - Topic: "{form.topic.get('topic', 'No topic provided')}"
        - Style: "{form.style.get('style', 'Default')}"
        - Duration: {form.duration.get('value', '30')} seconds
        - Language: "{form.language.get('languages', 'English')}"
        - Voice: "{form.voice.get('voice', 'Unknown')}"

        Constraints:
        - Write a short, engaging narration for a short video in the given language.
        - Make sure the narration matches the style.
        - Keep narration short enough for the given duration.
        - Use spoken, natural, captivating tone.
        - The JSON must be parsable directly using `json.loads()`.
        """.strip()


def build_prompt_full_script(form: FullScriptRequest) -> str:
    return f"""
    You are an API that **only** responds with raw JSON. Do not include Markdown formatting (like triple backticks) and do not explain anything.

    Respond in this **exact** JSON format:
    {{
        "title": "string",
        "narration": "string",
        "duration_seconds": number,
        "language": "string",
        "voice": "string",
        "full_script": [
            {{
                "id": number,
                "segment_index": number,
                "text": "string",                // dialogue or narration
                "start_time": number,
                "end_time": number,
                "duration": number,
                "description_image": "string"    // vivid, realistic scene description in English, matching the narration
            }}
        ]
    }}

    Now based on the rough narration script and the following information, generate a detailed, engaging, and well-paced video script:

    - Rough Narration script: "{form.script or 'No script provided'}"
    - Topic: "{form.topic.get('topic', 'No topic provided')}"
    - Style: "{form.style.get('style', 'default')}"
    - Duration: {form.duration.get('value', '30')} seconds
    - Language: "{form.language.get('languages', 'English')}"
    - Voice: "{form.voice.get('voice', 'Unknown')}"
    - Title: "{form.title or 'No title provided'}"

    Requirements:
    1. Divide the script into multiple natural segments that fit well within the total duration.
    2. Make sure each segment’s text matches the actual speaking speed of the given voice.
       - Adjust or rewrite text as necessary so that each segment's narration feels natural — not rushed or too slow.
       - Calculate and align each segment’s start_time, end_time, and duration accordingly.
    3. Each segment must include:
       - `text`: a natural, well-paced narration or dialogue, length don't exceed 20 words. Ensure the text is engaging, clear, and suitable for the selected voice.
       - `description_image`: a highly detailed, vivid scene description that matches the `text`.
           - The image description must be realistic, expressive, and visually rich.
           - The content must visually reflect exactly what the narration says.
           - The scene must be described in a cinematic, animation-style way (for cartoon rendering).
           - Use descriptive colors, lighting, setting, and motion to enhance the image quality.
           - Tailor the description to match the selected style: "{form.style.get('style', 'default')}".
           - Avoid abstract or generic phrasing — make the image renderable and imaginative.

    Output requirements:
        - Return **only** valid raw JSON — no markdown, no triple backticks, no explanation.
        - All field names must be double-quoted. All strings must be escaped properly.
        - The JSON must be parsable directly using `json.loads()`.
    """.strip()
