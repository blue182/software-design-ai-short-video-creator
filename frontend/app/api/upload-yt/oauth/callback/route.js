// GET /upload-yt/oauth/callback
import { google } from 'googleapis';

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    'http://localhost:3000/upload-yt/oauth/callback'
  );

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const user = await oauth2.userinfo.get();

  // Bạn có thể lưu tokens.refresh_token + user.data.email vào DB ở đây
  console.log("Email:", user.data.email);
  console.log("Refresh Token:", tokens.refresh_token);

  return new Response(`
    <html>
      <body>
        <h2>Connected as ${user.data.email}</h2>
        <pre>refresh_token: ${tokens.refresh_token}</pre>
        <p>Copy token về hệ thống của bạn để upload video.</p>
      </body>
    </html>`, {
    headers: { 'Content-Type': 'text/html' }
  });
}