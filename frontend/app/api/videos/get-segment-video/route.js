import { getAllSegmentsByVideoId } from '@/lib/db/videos'; // Adjust the import path as necessary

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');
    console.log("🔍 Fetching segments for video ID:", videoId);

    if (!videoId) {
        return new Response(JSON.stringify({ error: 'videoId is required' }), { status: 400 });
    }

    try {
        const segments = await getAllSegmentsByVideoId(videoId);
        if (!segments || segments.length === 0) {
            return new Response(JSON.stringify({ error: 'No segments found for this video' }), { status: 404 });
        }

        return new Response(JSON.stringify(segments), { status: 200 });
    } catch (err) {
        console.error('❌ Error fetching video segments:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch video segments' }), { status: 500 });
    }
}