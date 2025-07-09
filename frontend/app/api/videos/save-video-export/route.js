import { updateExportVideoUrl } from '@/lib/db/videos';

export async function POST(req) {
    const { videoId, videoUrl } = await req.json();
    if (!videoId || !videoUrl) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    try {
        await updateExportVideoUrl(videoId, videoUrl);
        console.log('✅ Video export URL updated successfully:', videoUrl);
        return new Response(JSON.stringify({ ok: true, videoId, videoUrl }), { status: 200 });
    }
    catch (err) {
        console.error('❌ Error updating video export URL:', err);
        return new Response(JSON.stringify({ error: 'Failed to update video export URL' }), { status: 500 });
    }
}