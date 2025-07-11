// app/api/upload-yt/route.js
import { google } from 'googleapis';
import { Readable } from 'stream'; 
import { updateYoutubeUrl } from '@/lib/db/videos';

export async function POST(req) {
  try {
    const { title, description, videoUrl, videoId } = await req.json();

    const oauth2Client = new google.auth.OAuth2(
      process.env.YT_CLIENT_ID,
      process.env.YT_CLIENT_SECRET,
      process.env.YT_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.YT_REFRESH_TOKEN,
    });

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // Fetch video từ Cloudinary
    const res = await fetch(videoUrl);
    const buffer = await res.arrayBuffer();
    const file = Buffer.from(buffer);

    // 🔥 Convert Buffer thành stream
    const stream = Readable.from(file);

    // Upload video lên YouTube
    const uploadRes = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title || 'AI Generated Video',
          description: description || 'From Aizento',
        },
        status: {
          privacyStatus: 'unlisted',
        },
      },
      media: {
        mimeType: 'video/mp4',
        body: stream, // ✅ phải là stream, không phải Buffer
      },
    });

    const youtubeUrl = `https://www.youtube.com/watch?v=${uploadRes.data.id}`;

    //save db
    await updateYoutubeUrl(videoId, youtubeUrl);

    return new Response(JSON.stringify({ youtubeUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('YouTube upload error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// app/api/upload-yt/route.js
// import { google } from 'googleapis';
// import { Readable } from 'stream';

// export async function POST(req) {
//   try {
//     const { title, description, videoUrl, refreshToken } = await req.json();

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.YT_CLIENT_ID,
//       process.env.YT_CLIENT_SECRET,
//       'http://localhost:3000/upload-yt/oauth/callback' // Phải khớp với redirect_uri đã khai báo
//     );

//     oauth2Client.setCredentials({ refresh_token: refreshToken });

//     const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

//     const res = await fetch(videoUrl);
//     const buffer = await res.arrayBuffer();
//     const file = Buffer.from(buffer);
//     const stream = Readable.from(file);

//     const uploadRes = await youtube.videos.insert({
//       part: ['snippet', 'status'],
//       requestBody: {
//         snippet: {
//           title: title || 'AI Generated Video',
//           description: description || 'From Aizento',
//         },
//         status: { privacyStatus: 'unlisted' },
//       },
//       media: {
//         mimeType: 'video/mp4',
//         body: stream,
//       },
//     });

//     const youtubeUrl = `https://www.youtube.com/watch?v=${uploadRes.data.id}`;

//     return new Response(JSON.stringify({ youtubeUrl }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });

//   } catch (err) {
//     console.error('[UPLOAD ERROR]', err.message);
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }