import { google } from 'googleapis';

export async function GET(req, { params }) {
  const videoId = params.id;

  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.YT_REFRESH_TOKEN,
  });

  try {
    // Không cần gọi getAccessToken(), googleapis tự refresh khi gọi API
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const response = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: [videoId],
    });

    const video = response.data.items[0];

    if (!video) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        videoId,
        title: video.snippet.title,
        stats: {
          views: parseInt(video.statistics.viewCount),
          likes: parseInt(video.statistics.likeCount),
          comments: parseInt(video.statistics.commentCount || 0),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('❌ YouTube API error:', err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: err.response?.data?.error?.message || err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
