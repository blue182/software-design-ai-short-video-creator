# from serpapi import GoogleSearch

# def filter_by_category_id(trends, target_id=4):
#     """
#     Lọc trends theo category ID (ví dụ: 7 = Health)

#     :param trends: Danh sách trends (list of dict)
#     :param target_id: ID của category cần lọc
#     :return: Danh sách trends có chứa category ID tương ứng
#     """
#     filtered = []
#     for trend in trends:
#         for cat in trend.get("categories", []):
#             if cat.get("id") == target_id:
#                 filtered.append(trend)
#                 break  # Nếu đã có category khớp thì không cần xét thêm

#     return filtered



# def fetch_trending():
#     params = {
#     "engine": "google_trends_autocomplete",
#     "q": "short video",
#     "api_key": "5ae63d7b907b6d2d06a21b75467587ec0c0d404f8ac311ab4c66ec3aa12bc8e8"
#     }


#     search = GoogleSearch(params)
#     results = search.get_dict()
#     print("Kết quả tìm kiếm:", results)
#     suggestions = [item["title"] for item in results.get("topics", [])]
#     print("🔥 Gợi ý xu hướng tìm kiếm liên quan đến 'short video':"
#           f"\n{', '.join(suggestions)}")

#     # # Kiểm tra dữ liệu
#     # trending_stories = results["trending_searches"]
#     # # Lọc các xu hướng liên quan đến video
#     # trending_stories = filter_by_category_id(trending_stories)


#     # print("Dữ liệu trending:", trending_stories)

#     # if not trending_stories:
#     #     print("❌ Không lấy được dữ liệu")
#     #     return

#     # print("🔥 Top xu hướng theo thời gian thực tại VN:")
#     # for idx, item in enumerate(trending_stories[:10], 1):
#     #     print(f"{idx}. {item['query']}\n")

# if __name__ == "__main__":
#     fetch_trending()



# from serpapi import GoogleSearch

# API_KEY = "5ae63d7b907b6d2d06a21b75467587ec0c0d404f8ac311ab4c66ec3aa12bc8e8"  # ⚠️ Đổi thành API key thật

# def get_related_keywords():
#     """Lấy danh sách từ khóa liên quan đến 'short video' từ Google Trends Autocomplete"""
#     params = {
#         "engine": "google_trends_autocomplete",
#         "q": "short video",
#         "api_key": API_KEY
#     }

#     search = GoogleSearch(params)
#     results = search.get_dict()

#     if "suggestions" not in results:
#         print("❌ Không tìm thấy trường 'suggestions' trong phản hồi autocomplete.")
#         print("1.👉 Kết quả trả về:", results)
#         return []

#     suggestions = [item["title"] for item in results["suggestions"]]
#     print("✅ Từ khóa liên quan tìm được:")
#     for i, keyword in enumerate(suggestions, 1):
#         print(f"{i}. {keyword}")
#     return suggestions


# def fetch_trending_searches():
#     """Lấy trending search tại Việt Nam"""
#     params = {
#         "engine": "google_trends",
#         "geo": "VN",
#         "data_type": "RELATED_TOPICS",
#         "cat": "0",  # Lấy tất cả các danh mục
#         "api_key": API_KEY
#     }

#     search = GoogleSearch(params)
#     results = search.get_dict()

#     if "trending_searches" not in results:
#         print("❌ Không có trường 'trending_searches' trong kết quả.")
#         print("2.👉 Kết quả trả về:", results)
#         return []

#     print("✅ Lấy được trending search tại Việt Nam:")
#     for item in results["trending_searches"]:
#         print("-", item["query"])
#     return results["trending_searches"]


# def filter_video_trends(trending, keywords):
#     """Lọc trending search theo các từ khóa liên quan đến video"""
#     video_trends = []
#     for trend in trending:
#         query = trend["query"].lower()
#         for keyword in keywords:
#             if keyword.lower() in query:
#                 video_trends.append(trend)
#                 break
#     return video_trends


# def main():
#     trending = fetch_trending_searches()
#     if not trending:
#         return

#     keywords = get_related_keywords()
#     if not keywords:
#         return

#     related_trends = filter_video_trends(trending, keywords)
#     if not related_trends:
#         print("⚠️ Không có trending nào liên quan đến short video.")
#         return

#     print("\n🔥 Các trending liên quan đến short video:")
#     for i, trend in enumerate(related_trends, 1):
#         print(f"{i}. {trend['query']}")


# if __name__ == "__main__":
#     main()



from serpapi import GoogleSearch

API_KEY = "5ae63d7b907b6d2d06a21b75467587ec0c0d404f8ac311ab4c66ec3aa12bc8e8"  # ⚠️ Thay bằng API key thật


def fetch_hot_topics_vietnam():
    """
    Lấy các chủ đề thịnh hành ở Việt Nam theo thời gian thực (REALTIME_TRENDS)
    """
    params = {
        "engine": "google_trends",
        "geo": "VN",
        "data_type": "REALTIME_TRENDS",
        "hl": "vi",
        "api_key": API_KEY
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    if "story_summary" not in results:
        print("❌ Không có dữ liệu story_summary.")
        print("👉 Kết quả trả về:", results)
        return []

    hot_topics = []
    for story in results["story_summary"]:
        title = story.get("title", "")
        articles = story.get("articles", [])

        # Mỗi story có thể gồm nhiều bài viết
        for article in articles:
            hot_topics.append({
                "headline": article.get("title", ""),
                "snippet": article.get("snippet", ""),
                "source": article.get("source", ""),
                "url": article.get("url", "")
            })

    return hot_topics


def main():
    hot_topics = fetch_hot_topics_vietnam()
    if not hot_topics:
        return

    print("🔥 Chủ đề đang thịnh hành tại Việt Nam:")
    for i, topic in enumerate(hot_topics[:10], 1):
        print(f"{i}. {topic['headline']} ({topic['source']})")
        print(f"   {topic['snippet']}")
        print(f"   📎 {topic['url']}\n")


if __name__ == "__main__":
    main()
