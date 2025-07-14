import { google } from 'googleapis';
import { db } from '@/configs/db'; // đường dẫn DB của bạn
import { videos } from '@/lib/db/videos'; // bảng videos
import { eq, isNotNull } from 'drizzle-orm';

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: process.env.YT_REFRESH_TOKEN });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  try {
    // Lấy tất cả video có ytb_url
    const videoList = await db.select().from(videos).where(isNotNull(videos.ytb_url));

    const statsList = [];

    for (const v of videoList) {
      const videoId = new URL(v.ytb_url).searchParams.get("v");
      if (!videoId) continue;

      const res = await youtube.videos.list({
        part: ['statistics', 'snippet'],
        id: [videoId],
      });

      const item = res.data.items[0];
      if (item) {
        statsList.push({
          videoId,
          title: item.snippet.title,
          views: parseInt(item.statistics.viewCount),
          likes: parseInt(item.statistics.likeCount),
          comments: parseInt(item.statistics.commentCount || 0),
        });
      }
    }

    return new Response(JSON.stringify({ stats: statsList }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error("❌ YouTube Stats API error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}