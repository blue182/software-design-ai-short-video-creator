// File: lib/db/video.js
const { db } = require('../../configs/db');
const { videos } = require('../../configs/schemas/videos');
const { segments } = require('../../configs/schemas/segments');
const { eq } = require('drizzle-orm');




async function createVideo(videoData) {
    // console.log('📦 Creating video with data:', videoData);

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
    } = videoData;

    const value = {
        userId,
        title: title || null,
        topic: topic?.topic || null,
        styleId: style?.id || null,
        voiceId: voice?.id || null,
        languageId: languages?.id || null,
        durationId: duration?.id || null,
        finalVideoUrl: video_url || null,
        backgroundMusicUrl: background_music_url || null,
        status,
        id_cloud: id_cloud || null,
        createdAt: new Date(), // nếu cần override
        updatedAt: new Date(),
        deletedAt: null, // nếu cần override
        video_size: video_size ? JSON.stringify(video_size) : null, // Convert to JSON string if needed
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


/**
 * Update or insert a list of segments for a video
 * @param {Array<Object>} segmentList - List of segment objects to update/insert
 */
async function insertSegments(videoId, segmentsData) {
    // console.log(`📦 Inserting segments for video ID ${videoId}`, segmentsData);
    if (!videoId || !Array.isArray(segmentsData)) {
        throw new Error('Missing videoId or segmentsData must be an array.');
    }

    console.log(`📦 Inserting segments for video ID ${videoId}`, segmentsData);

    // const formattedSegments = await Promise.all(
    //     segmentsData.map(async (segment, index) => ({
    //         videoId,
    //         segmentIndex: Number.isInteger(segment.segment_index) ? segment.segment_index : index,
    //         text: segment.text ?? '',
    //         descriptionImage: segment.description_image ?? null,
    //         imageUrl: segment.image_url ?? null,
    //         voiceUrl: segment.audio_url ?? null, // 👈 fix tại đây

    //         start_time: typeof segment.start_time === 'number' ? segment.start_time : 0,
    //         end_time: typeof segment.end_time === 'number' ? segment.end_time : 1,

    //         animation: segment.animation ?? null,
    //         fontSize: Number.isInteger(segment.font_size) ? segment.font_size : 20,
    //         strokeColor: segment.stroke_color ?? 'black',
    //         strokeWidth: Number.isInteger(segment.stroke_width) ? segment.stroke_width : 2,
    //         subtitleBg: segment.subtitle_bg ?? 'rgba(0,0,0,0.5)',
    //         subtitleColor: segment.subtitle_color ?? 'white',
    //         subtitleEnabled: typeof segment.subtitle_enabled === 'boolean' ? segment.subtitle_enabled : false,
    //         spaceBottom: Number.isInteger(segment.space_bottom) ? segment.space_bottom : 0,

    //         textStyles: JSON.stringify(segment.text_styles ?? []),
    //     }))
    // );



    const formattedSegments = await Promise.all(
        segmentsData.map(async (segment, index) => {
            const audioUrl = typeof segment.audio_url?.then === 'function'
                ? await segment.audio_url
                : segment.audio_url;

            return {
                videoId,
                segmentIndex: Number.isInteger(segment.segment_index) ? segment.segment_index : index,
                text: segment.text ?? '',
                descriptionImage: segment.description_image ?? null,
                imageUrl: segment.image_url ?? null,
                voiceUrl: audioUrl ?? null,

                start_time: typeof segment.start_time === 'number' ? segment.start_time : 0,
                end_time: typeof segment.end_time === 'number' ? segment.end_time : 1,

                animation: segment.animation ?? null,
                fontSize: Number.isInteger(segment.font_size) ? segment.font_size : 20,
                strokeColor: segment.stroke_color ?? 'black',
                strokeWidth: Number.isInteger(segment.stroke_width) ? segment.stroke_width : 2,
                subtitleBg: segment.subtitle_bg ?? 'rgba(0,0,0,0.5)',
                subtitleColor: segment.subtitle_color ?? 'white',
                subtitleEnabled: typeof segment.subtitle_enabled === 'boolean' ? segment.subtitle_enabled : false,
                spaceBottom: Number.isInteger(segment.space_bottom) ? segment.space_bottom : 0,

                textStyles: JSON.stringify(segment.text_styles ?? []),
            };
        })
    );


    try {
        await db.insert(segments).values(formattedSegments);
        console.log(`✅ Inserted ${formattedSegments.length} segments for video ID ${videoId}`);
    } catch (err) {
        console.error('❌ Failed to insert segments:', err);
        throw err;
    }
}

/**
 * Update final video URL for a given video ID
 * @param {number} videoId
 * @param {string} finalVideoUrl
 */
async function updateFinalVideoUrl(videoId, finalVideoUrl) {
    await db
        .update(videos)
        .set({ finalVideoUrl })
        .where(eq(videos.id, videoId));
}

module.exports = {
    createVideo,
    insertSegments,
    updateFinalVideoUrl,
};
