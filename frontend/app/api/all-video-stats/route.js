// // // app/api/all-video-stats/route.js
// // import { google } from 'googleapis';

// // export async function GET() {
// //   try {
// //     const oauth2Client = new google.auth.OAuth2(
// //       process.env.YT_CLIENT_ID,
// //       process.env.YT_CLIENT_SECRET,
// //       process.env.YT_REDIRECT_URI
// //     );

// //     oauth2Client.setCredentials({
// //       refresh_token: process.env.YT_REFRESH_TOKEN,
// //     });

// //     const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
// //     const analytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });

// //     // 🔍 Lấy danh sách video đã đăng từ kênh
// //     const searchRes = await youtube.search.list({
// //       part: ['snippet'],
// //       forMine: true,
// //       type: ['video'],
// //       maxResults: 5, // lấy 5 video gần nhất, có thể tăng
// //     });

// //     const videos = searchRes.data.items || [];
// //     const result = [];

// //     for (const video of videos) {
// //       const videoId = video.id.videoId;
// //       const title = video.snippet.title;

// //       const analyticsRes = await analytics.reports.query({
// //         ids: 'channel==MINE',
// //         startDate: '2025-01-01', // chỉnh theo nhu cầu
// //         endDate: '2025-12-31',
// //         metrics: 'views,likes,estimatedMinutesWatched',
// //         dimensions: 'day',
// //         filters: `video==${videoId}`,
// //         sort: 'day',
// //       });

// //       const stats = analyticsRes.data.rows || [];

// //       result.push({
// //         videoId,
// //         title,
// //         stats: stats.map(([date, views, likes, minutes]) => ({
// //           date,
// //           views,
// //           likes,
// //           minutes,
// //         })),
// //       });
// //     }

// //     return new Response(JSON.stringify(result), {
// //       status: 200,
// //       headers: { 'Content-Type': 'application/json' },
// //     });
// //   } catch (err) {
// //     console.error('YouTube stats error:', err.message);
// //     return new Response(JSON.stringify({ error: err.message }), {
// //       status: 500,
// //       headers: { 'Content-Type': 'application/json' },
// //     });
// //   }
// // }


// // app/api/all-video-stats/route.js
// // app/api/all-video-stats/route.js
// import { google } from 'googleapis';

// export async function GET() {
//   try {
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.YT_CLIENT_ID,
//       process.env.YT_CLIENT_SECRET,
//       process.env.YT_REDIRECT_URI
//     );

//     oauth2Client.setCredentials({
//       refresh_token: process.env.YT_REFRESH_TOKEN,
//     });

//     const youtube = google.youtube({
//       version: 'v3',
//       auth: oauth2Client,
//     });

//     // 🔥 Lấy danh sách video upload (tối đa 50 video đầu tiên)
//     const searchRes = await youtube.search.list({
//       part: ['snippet'],
//       maxResults: 50,
//       forMine: true,
//       type: ['video'],
//     });

//     const videoIds = searchRes.data.items.map(item => item.id.videoId).filter(Boolean);

//     if (videoIds.length === 0) {
//       return new Response(JSON.stringify([]), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // 🔥 Lấy thống kê view của các video
//     const videosRes = await youtube.videos.list({
//       part: ['statistics', 'snippet'],
//       id: videoIds,
//     });

//     const result = videosRes.data.items.map(item => ({
//       videoId: item.id,
//       title: item.snippet.title,
//       stats: [
//         {
//           date: new Date().toISOString().split('T')[0], // chỉ lấy ngày hôm nay
//           views: parseInt(item.statistics.viewCount || '0'),
//         },
//       ],
//     }));

//     return new Response(JSON.stringify(result), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });

//   } catch (err) {
//     console.error('❌ Error in all-video-stats API:', err.message);
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }



// /app/api/statistics/video/[id]/route.js
// app/api/statistics/video/[id]/route.js
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

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: [videoId],
    });

    const video = response.data.items[0];

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
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
