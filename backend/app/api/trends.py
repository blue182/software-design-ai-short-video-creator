from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List
import random
import logging
import os
from dotenv import load_dotenv

from serpapi import GoogleSearch
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from pydantic import BaseModel



router = APIRouter()

load_dotenv()
# --- Config ---
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
GEO = "VN"
HL = "en"
MAX_KEYWORDS = 10
MAX_PER_TOPIC = 2

TRENDS_CONFIG = {
    "categories": {
        "all": 0.2, "b": 0.3, "e": 0.1, "m": 0.15, "t": 0.15, "s": 0.05, "h": 0.05
    },
    "time_ranges": ["now 1-d", "now 7-d", "today 1-m"],
    "data_types": ["top_charts", "rising_topics", "related_topics"]
}

NOUN_SEEDS = ["movies", "books", "technology", "music", "travel", "brands"]
BANNED_WORDS = ["politics", "violence", "xxx", "suicide", "drugs", "gambling", "http"]
QUESTION_WORDS = ["how", "why", "should", "guide", "tips", "can", "is"]
MAX_WORDS = 5

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# --- Pydantic Response Model ---
class TrendsResponse(BaseModel):
    keywords: List[str]
    attempts: int
    timestamp: datetime


# --- Helpers ---
def is_valid_keyword(kw: str) -> bool:
    if not kw or len(kw.split()) > MAX_WORDS:
        return False
    lower = kw.lower()
    return not any(b in lower for b in BANNED_WORDS + QUESTION_WORDS)


def weighted_random_choice(options):
    total = sum(options.values())
    rand = random.uniform(0, total)
    acc = 0
    for key, weight in options.items():
        acc += weight
        if rand <= acc:
            return key
    return random.choice(list(options.keys()))


def fetch_trends(attempt: int):
    try:
        params = {
            "engine": "google_trends",
            "geo": GEO,
            "hl": HL,
            "category": weighted_random_choice(TRENDS_CONFIG["categories"]),
            "date": random.choice(TRENDS_CONFIG["time_ranges"]),
            "api_key": SERPAPI_KEY
        }
        logger.info(f"[{attempt}] Trends Params: {params}")
        results = GoogleSearch(params).get_dict()

        keywords = []
        for dtype in TRENDS_CONFIG["data_types"]:
            for item in results.get(dtype, []):
                for key in ["title", "topic_title", "query", "name"]:
                    if key in item:
                        kw = item[key].strip()
                        if is_valid_keyword(kw):
                            keywords.append(kw)
        return list(set(keywords))
    except Exception as e:
        logger.error(f"[{attempt}] Trends error: {e}")
        return []


def fetch_autocomplete(attempt: int):
    try:
        random.shuffle(NOUN_SEEDS)
        keywords = []
        for seed in NOUN_SEEDS[:5]:  # 🔁 thử 5 seed mỗi lần
            params = {
                "engine": "google_autocomplete",
                "q": seed,
                "hl": HL,
                "api_key": SERPAPI_KEY
            }
            logger.info(f"[{attempt}] Autocomplete seed: {seed}")
            results = GoogleSearch(params).get_dict()
            new_kw = [
                sug["value"] for sug in results.get("suggestions", [])
                if is_valid_keyword(sug.get("value", ""))
            ]
            keywords.extend(new_kw[:2])  # Lấy tối đa 2 từ/seed
        return keywords
    except Exception as e:
        logger.error(f"[{attempt}] Autocomplete error: {e}")
        return []

def cluster_keywords(keywords):
    if len(keywords) <= MAX_KEYWORDS:
        return keywords
    try:
        tfidf = TfidfVectorizer(stop_words='english')
        X = tfidf.fit_transform(keywords)
        model = KMeans(n_clusters=min(5, len(keywords)), random_state=42, n_init=10)
        labels = model.fit_predict(X)

        grouped = {}
        for kw, label in zip(keywords, labels):
            grouped.setdefault(label, []).append(kw)

        result = []
        for group in grouped.values():
            random.shuffle(group)
            result.extend(group[:MAX_PER_TOPIC])

        random.shuffle(result)
        return result[:MAX_KEYWORDS]
    except Exception as e:
        logger.error(f"Clustering error: {e}")
        return random.sample(keywords, min(MAX_KEYWORDS, len(keywords)))


# --- Main API Route ---
@router.get("/", response_model=TrendsResponse, summary="Get trending keywords")
def get_trending_keywords():
    all_keywords = []
    for i in range(1, 11):
        if random.random() < 0.7:
            keywords = fetch_trends(i)
        else:
            keywords = fetch_autocomplete(i)

        for kw in keywords:
            if kw not in all_keywords:
                all_keywords.append(kw)
                if len(all_keywords) >= 25:
                    break
        if len(all_keywords) >= 25:
            break

    if not all_keywords:
        raise HTTPException(status_code=500, detail="Failed to fetch trends")

    final_keywords = cluster_keywords(all_keywords)

    return TrendsResponse(
        keywords=final_keywords,
        attempts=i,
        timestamp=datetime.now()
    )