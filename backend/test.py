from serpapi import GoogleSearch

def filter_by_category_id(trends, target_id=4):
    """
    Lọc trends theo category ID (ví dụ: 7 = Health)

    :param trends: Danh sách trends (list of dict)
    :param target_id: ID của category cần lọc
    :return: Danh sách trends có chứa category ID tương ứng
    """
    filtered = []
    for trend in trends:
        for cat in trend.get("categories", []):
            if cat.get("id") == target_id:
                filtered.append(trend)
                break  # Nếu đã có category khớp thì không cần xét thêm

    return filtered



def fetch_trending():
    params = {
    "engine": "google_trends_trending_now",
    "geo": "US",
    "api_key": "5ae63d7b907b6d2d06a21b75467587ec0c0d404f8ac311ab4c66ec3aa12bc8e8"
    }


    search = GoogleSearch(params)
    results = search.get_dict()

    # Kiểm tra dữ liệu
    trending_stories = results["trending_searches"]
    # Lọc các xu hướng liên quan đến video
    trending_stories = filter_by_category_id(trending_stories)


    # print("Dữ liệu trending:", trending_stories)

    if not trending_stories:
        print("❌ Không lấy được dữ liệu")
        return

    print("🔥 Top xu hướng theo thời gian thực tại VN:")
    for idx, item in enumerate(trending_stories[:10], 1):
        print(f"{idx}. {item['query']}\n")

if __name__ == "__main__":
    fetch_trending()
