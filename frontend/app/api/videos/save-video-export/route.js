import { updateExportVideoUrl, updateSegmentsForVideo } from '@/lib/db/videos';

export async function POST(req) {
    const { videoId, videoUrl, segments } = await req.json();
    if (!videoId || !videoUrl) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    try {
        await updateExportVideoUrl(videoId, videoUrl);
        console.log('✅ Video export URL updated successfully:', videoUrl);

        if (Array.isArray(segments) && segments.length > 0) {
            await updateSegmentsForVideo(videoId, segments);
            console.log(`✅ Updated ${segments.length} segments for video ${videoId}`);
        }

        return new Response(JSON.stringify({ ok: true, videoId, videoUrl }), { status: 200 });
    }
    catch (err) {
        console.error('❌ Error updating video export URL:', err);
        return new Response(JSON.stringify({ error: 'Failed to update video export URL' }), { status: 500 });
    }
}