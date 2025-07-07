import hashlib
import requests
from app.core.config import settings  # Lấy key từ .env
from urllib.parse import quote

# Danh sách prompt tương ứng với style
STYLE_PROMPT_VARIANTS = {
    "Cinematic": [
        "cinematic background music",
        "epic cinematic soundtrack",
        "film score instrumental",
        "dramatic cinematic music"
    ],
    "Funny": [
        "funny cartoon music",
        "playful comedy instrumental",
        "quirky upbeat tune",
        "cheerful funny soundtrack"
    ],
    "Motivational": [
        "motivational background music",
        "uplifting corporate music",
        "energetic inspirational music",
        "inspiring upbeat instrumental"
    ],
    "Romantic": [
        "romantic piano instrumental",
        "soft love background music",
        "gentle romantic soundtrack",
        "emotional violin music"
    ],
    "Tutorial": [
        "tutorial background music",
        "calm corporate music",
        "soft tech background music",
        "educational instrumental music"
    ],
    "Cartoon": [
        "cartoon background music",
        "anime happy instrumental",
        "cute cartoon soundtrack",
        "fun playful cartoon music"
    ],
    "Aesthetic": [
        "lofi chill music",
        "aesthetic background music",
        "relaxing lofi instrumental",
        "chillhop beat"
    ],
    "Review": [
        "cleantech background music",
        "product review music",
        "neutral corporate instrumental",
        "tech background soundtrack"
    ],
    "Storytelling": [
        "storytelling background music",
        "emotional story soundtrack",
        "narration background music",
        "cinematic storytelling music"
    ],
    "Glitch": [
        "glitch electronic music",
        "cyberpunk background music",
        "futuristic glitch instrumental",
        "edgy electronic soundtrack"
    ],
    "__default__": [
        "background music instrumental",
        "ambient background music",
        "soft instrumental music"
    ]
}


def generate_music_prompt(style: str, seed: str) -> str:
    """
    Sinh prompt tìm nhạc phù hợp với style và seed, giúp tránh trùng lặp nhạc.
    """
    variants = STYLE_PROMPT_VARIANTS.get(style, STYLE_PROMPT_VARIANTS["__default__"])
    seed_hash = int(hashlib.md5(seed.encode()).hexdigest(), 16)
    index = seed_hash % len(variants)
    return variants[index]





def get_music_url_by_style(style: str, seed: str) -> str:
    if not settings.PIXABAY_API_KEY:
        raise RuntimeError("PIXABAY_API_KEY is missing from environment.")

    prompt = generate_music_prompt(style, seed)
    query = quote(prompt)
    api_url = f"https://pixabay.com/api/music/?key={settings.PIXABAY_API_KEY}&q={query}&per_page=3"

    print(f"[Pixabay] Querying: {api_url}")

    try:
        response = requests.get(api_url, timeout=5)
        if response.status_code != 200:
            print(f"[Pixabay] API failed with status {response.status_code}")
            return settings.DEFAULT_MUSIC_URL

        data = response.json()
        if data["total"] == 0 or not data["hits"]:
            print(f"[Pixabay] No music found for: {prompt}")
            return settings.DEFAULT_MUSIC_URL

        seed_hash = int(hashlib.sha256(seed.encode()).hexdigest(), 16)
        index = seed_hash % len(data["hits"])
        return data["hits"][index]["audio"]

    except Exception as e:
        print(f"[Pixabay] Exception occurred: {e}")
        return settings.DEFAULT_MUSIC_URL
