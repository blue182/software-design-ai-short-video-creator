// File: frontend/app/api/videos/get-list-videos/route.js
import { getExportedVideos, getPreviewVideosWithFirstSegment } from '@/lib/db/videos';


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
    }

    try {
        const listVideosExported = await getExportedVideos(userId);
        const listVideoPreview = await getPreviewVideosWithFirstSegment(userId);
        const videos = {
            exported: listVideosExported,
            preview: listVideoPreview
        };

        return new Response(JSON.stringify(videos), { status: 200 });
    } catch (err) {
        console.error('❌ Error fetching videos:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch videos' }), { status: 500 });
    }
}