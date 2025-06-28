from fastapi import APIRouter, HTTPException
from pytrends.request import TrendReq

router = APIRouter()

@router.get("/", summary="Get Google Trends data")
def get_trending_topics():
    """
    Fetch trending topics from Google Trends.
    Tries 'vietnam' first, fallback to 'united_states'.
    """
    pytrends = TrendReq(hl='en-US', tz=360)
    for region in ['vietnam', 'united_states']:
        try:
            df = pytrends.trending_searches(pn=region)
            return {
                "region": region,
                "trending_searches": df[0].tolist()[:10]
            }
        except Exception:
            continue  # thử region kế tiếp

    raise HTTPException(status_code=500, detail="Failed to fetch trending topics from Google Trends.")
