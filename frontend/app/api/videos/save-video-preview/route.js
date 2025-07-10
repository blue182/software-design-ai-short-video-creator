import { updateSegmentsForVideo, updateUpdatedAt } from '@/lib/db/videos';

export async function POST(req) {
    try {
        const { videoId, segments } = await req.json();

        if (!videoId || !Array.isArray(segments)) {
            return new Response(JSON.stringify({ error: 'Missing videoId or invalid segments format' }), {
                status: 400,
            });
        }

        if (segments.length > 0) {
            await updateSegmentsForVideo(videoId, segments);
            console.log(`✅ Updated ${segments.length} segments for video ${videoId}`);
        } else {
            console.log(`⚠️ Received empty segment list for video ${videoId}, no update performed.`);
        }

        await updateUpdatedAt(videoId);
        console.log(`✅ Updated updated_at timestamp for video ${videoId}`);

        return new Response(JSON.stringify({ ok: true, videoId, segmentsCount: segments.length }), {
            status: 200,
        });

    } catch (err) {
        console.error('❌ Error in save-video-preview API:', err);
        return new Response(JSON.stringify({ error: 'Failed to save video preview' }), {
            status: 500,
        });
    }
}
