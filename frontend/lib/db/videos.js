// File: lib/db/video.js
const { db } = require('../../configs/db');
const { videos } = require('../../configs/schemas/videos');
const { segments } = require('../../configs/schemas/segments');
const { eq } = require('drizzle-orm');



async function createVideo(videoData) {
    const {
        id_cloud,
        title,
        topic,
        style,
        voice,
        duration,
        video_url,
        video_size,
        languages,
        userId,
        background_music_url,
        status = 'pending',
        ytb_url,
    } = videoData;

    const value = {
        user_id: userId,
        title: title || null,
        topic: topic?.topic || null,
        style_id: style?.id || null,
        voice_id: voice?.id || null,
        language_id: languages?.id || null,
        duration_id: duration?.id || null,
        export_video_url: video_url || null,
        background_music_url: background_music_url || null,
        status,
        ytb_url: ytb_url || null,
        id_cloud: id_cloud || null,
        deleted_at: null,
        video_size: video_size ? JSON.stringify(video_size) : null,
    };

    try {
        const result = await db
            .insert(videos)
            .values(value)
            .returning({ id: videos.id });

        console.log('✅ Video created with ID:', result[0]?.id);
        return result[0]?.id;
    } catch (err) {
        console.error('❌ Error creating video:', err);
        return null;
    }
}


async function insertSegments(videoId, segmentsData) {
    if (!videoId || !Array.isArray(segmentsData)) {
        throw new Error('Missing videoId or segmentsData must be an array.');
    }

    const formattedSegments = await Promise.all(
        segmentsData.map(async (segment, index) => {
            const audioUrl = typeof segment.audio_url?.then === 'function'
                ? await segment.audio_url
                : segment.audio_url;

            return {
                video_id: videoId,
                segment_index: Number.isInteger(segment.segment_index) ? segment.segment_index : index,
                text: segment.text ?? '',
                description_image: segment.description_image ?? null,
                image_url: segment.image_url ?? null,
                audio_url: audioUrl ?? null,

                start_time: typeof segment.start_time === 'number' ? segment.start_time : 0,
                end_time: typeof segment.end_time === 'number' ? segment.end_time : 1,
                duration: typeof segment.duration === 'number' ? segment.duration : 1,

                animation: segment.animation ?? null,
                font_size: Number.isInteger(segment.font_size) ? segment.font_size : 20,
                stroke_color: segment.stroke_color ?? 'black',
                stroke_width: Number.isInteger(segment.stroke_width) ? segment.stroke_width : 2,
                subtitle_bg: segment.subtitle_bg ?? 'rgba(0,0,0,0.5)',
                subtitle_color: segment.subtitle_color ?? 'white',
                subtitle_enabled: typeof segment.subtitle_enabled === 'boolean' ? segment.subtitle_enabled : false,
                space_bottom: Number.isInteger(segment.space_bottom) ? segment.space_bottom : 0,

                text_styles: JSON.stringify(segment.text_styles ?? []),
            };
        })
    );

    try {
        await db.insert(segments).values(formattedSegments);
    }
    catch (err) {
        console.error('❌ Failed to insert segments:', err);
        throw err;
    }
}

async function getSegmentsByVideoId(videoId) {
    if (!videoId) {
        throw new Error('videoId is required');
    }

    const video_id = Number(videoId);

    try {
        const result = await db
            .select()
            .from(segments)
            .where(eq(segments.video_id, video_id))
            .orderBy(segments.segment_index);
        return result;
    }
    catch (err) {
        console.error('❌ Failed to retrieve segments:', err);
        throw err;
    }
}


async function updateExportVideoUrl(videoId, videoUrl) {
    const video_id = Number(videoId);
    if (!video_id || !videoUrl) {
        throw new Error('videoId and videoUrl are required');
    }

    try {
        const result = await db
            .update(videos)
            .set({ export_video_url: videoUrl, status: 'exported' })
            .where(eq(videos.id, video_id))
            .returning({ id: videos.id });

        const success = result.length > 0;
        if (success) {
            console.log('✅ Video export URL updated successfully for video ID:', video_id);
        } else {
            console.warn('⚠️ No video found with the given ID:', video_id);
        }

        return success;
    } catch (err) {
        console.error('❌ Error updating video export URL:', err);
        return false;
    }
}


module.exports = {
    createVideo,
    insertSegments,
    updateExportVideoUrl,
    getSegmentsByVideoId
};
