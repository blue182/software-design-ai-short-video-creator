// // frontend/app/upload-yt/oauth/auth-url/route.js

// import { google } from 'googleapis';

// export async function GET() {
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.YT_CLIENT_ID,
//     process.env.YT_CLIENT_SECRET,
//     "http://localhost:3000/upload-yt/oauth/callback"
//   );

//   const scopes = ['https://www.googleapis.com/auth/youtube.upload'];

//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: scopes,
//     prompt: 'consent',
//   });

//   return new Response(JSON.stringify({ authUrl }), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }