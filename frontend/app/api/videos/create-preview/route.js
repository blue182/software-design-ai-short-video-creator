import { createVideo, insertSegments, getSegmentsByVideoId } from '@/lib/db/videos';

export async function POST(req) {
    const { userId, infoVideo, segments } = await req.json();
    if (!userId || !infoVideo || !segments) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const videoData = {
        ...infoVideo,
        userId,
        status: 'pending', // default status
    };


    const videoId = await createVideo(videoData);
    if (!videoId) {
        return new Response(JSON.stringify({ error: 'Failed to create video' }), { status: 500 });
    }
    const segmentData = segments;

    try {
        // Assuming you have a function to save segments
        await insertSegments(videoId, segmentData);
    } catch (err) {
        console.error('Failed to save segments:', err);
        return new Response(JSON.stringify({ error: 'Failed to save segments' }), { status: 500 });
    }

    let savedSegments;

    try {
        // Fetch segments to ensure they are saved correctly
        savedSegments = await getSegmentsByVideoId(videoId);
    }
    catch (err) {
        console.error('Failed to fetch saved segments:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch saved segments' }), { status: 500 });
    }
    const framesList = savedSegments;

    return new Response(JSON.stringify({ ok: true, videoId, framesList }), { status: 200 });

}
