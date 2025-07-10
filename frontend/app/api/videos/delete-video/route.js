import { softDeleteVideo } from '@/lib/db/videos';

export async function DELETE(req) {
    const { videoId } = await req.json();
    if (!videoId) {
        return new Response(JSON.stringify({ error: 'Missing videoId' }), { status: 400 });
    }

    try {
        // Soft delete the video and its segments
        await softDeleteVideo(videoId);
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (err) {
        console.error('Failed to delete video:', err);
        return new Response(JSON.stringify({ error: 'Failed to delete video' }), { status: 500 });
    }
}
