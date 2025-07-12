// File: lib/db/video.js
const { db } = require('../../configs/db');
const { videos } = require('@/configs/schemas/videos');
const { styles } = require('@/configs/schemas/styles');
const { voices } = require('@/configs/schemas/voices');
const { languages } = require('@/configs/schemas/languages');
const { durations } = require('@/configs/schemas/durations');
const { segments } = require('@/configs/schemas/segments');
const { eq, desc, and } = require('drizzle-orm');


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
        status = 'preview',
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
                audio_text: segment.audio_text ?? null,
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

function normalizeTextStyles(value) {
    if (Array.isArray(value)) return value; // case: already an array
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return []; // fallback
}

function parseVideoSize(raw) {
    if (!raw) return null;

    try {
        // Nếu raw là object (không phải string) → trả luôn
        if (typeof raw === 'object') return raw;

        // Nếu raw là stringified JSON (1 hoặc 2 lần)
        const onceParsed = JSON.parse(raw);
        if (typeof onceParsed === 'object') return onceParsed;

        // Nếu vẫn là string → parse lần nữa
        return JSON.parse(onceParsed);
    } catch (err) {
        console.warn('⚠️ Failed to parse video_size:', err);
        return null;
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

        const parsedResult = result.map(segment => ({
            ...segment,
            text_styles: normalizeTextStyles(segment.text_styles),
        }));


        return parsedResult;
    }
    catch (err) {
        console.error('❌ Failed to retrieve segments:', err);
        throw err;
    }
}

async function updateUpdatedAt(videoId) {
    const video_id = Number(videoId);

    if (!video_id) {
        throw new Error('videoId is required');
    }
    try {
        const result = await db
            .update(videos)
            .set({ updated_at: new Date() })
            .where(eq(videos.id, video_id))
            .returning({ id: videos.id });
        const success = result.length > 0;
        if (success) {
            console.log('✅ Updated video updated_at successfully for video ID:', video_id);
        }
        else {
            console.warn('⚠️ No video found with the given ID:', video_id);
        }
        return success;
    } catch (err) {
        console.error('❌ Error updating video updated_at:', err);
        return false;
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
            .set({ export_video_url: videoUrl, status: 'exported', updated_at: new Date() })
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
// db/queries/videos.js 
async function updateYoutubeUrl(videoId, youtubeUrl) {
    const id = Number(videoId);
    if (!id || !youtubeUrl) throw new Error('videoId and youtubeUrl are required');

    const result = await db
        .update(videos)
        .set({ ytb_url: youtubeUrl, updated_at: new Date() })
        .where(eq(videos.id, id))
        .returning({ id: videos.id });

    const success = result.length > 0;
    if (success) {
        console.log('✅ ytb_url updated in database for video ID:', id);
    } else {
        console.warn('⚠️ No video found to update:', id);
    }
    return success;
}

async function getAllSegmentsByVideoId(videoId) {
    if (!videoId) {
        throw new Error('videoId is required');
    }

    try {
        const segmentsList = await db
            .select()
            .from(segments)
            .where(eq(segments.video_id, Number(videoId)))
            .orderBy(segments.segment_index);

        const parsedSegments = segmentsList.map(segment => ({
            ...segment,
            text_styles: normalizeTextStyles(segment.text_styles),
        }));

        return parsedSegments;
    } catch (err) {
        console.error('❌ Error fetching segments by videoId:', err);
        throw err;
    }
}


async function getPreviewVideosWithFirstSegment(userId) {
    if (!userId) throw new Error('userId is required');

    try {
        const previewVideos = await db
            .select({
                video: videos,
                style: styles,
                voice: voices,
                language: languages,
                duration: durations,
            })
            .from(videos)
            .leftJoin(styles, eq(videos.style_id, styles.id))
            .leftJoin(voices, eq(videos.voice_id, voices.id))
            .leftJoin(languages, eq(videos.language_id, languages.id))
            .leftJoin(durations, eq(videos.duration_id, durations.id))
            .where(and(eq(videos.user_id, userId), eq(videos.status, 'preview')))
            .orderBy(desc(videos.updated_at));

        const result = [];

        for (const row of previewVideos) {
            const { video, style, voice, language, duration } = row;
            const videoId = video.id;

            const firstSegment = await db
                .select()
                .from(segments)
                .where(eq(segments.video_id, videoId))
                .orderBy(segments.segment_index)
                .limit(1);

            if (!firstSegment.length) {
                throw new Error(`No segments found for video ID: ${videoId}`);
            }

            result.push({
                ...video,
                video_size: parseVideoSize(video.video_size),
                style,
                voice,
                language,
                duration,
                firstSegment: firstSegment[0] || null
            });
        }

        return result;
    } catch (err) {
        console.error('❌ Error fetching preview videos with joins:', err);
        throw err;
    }
}

async function getExportedVideos(userId) {
    if (!userId) throw new Error('userId is required');

    try {
        const exportedVideos = await db
            .select({
                video: videos,
                style: styles,
                voice: voices,
                language: languages,
                duration: durations,
            })
            .from(videos)
            .leftJoin(styles, eq(videos.style_id, styles.id))
            .leftJoin(voices, eq(videos.voice_id, voices.id))
            .leftJoin(languages, eq(videos.language_id, languages.id))
            .leftJoin(durations, eq(videos.duration_id, durations.id))
            .where(and(eq(videos.user_id, userId), eq(videos.status, 'exported')))
            .orderBy(desc(videos.updated_at));

        return exportedVideos.map(row => ({
            ...row.video,
            video_size: parseVideoSize(row.video.video_size),
            style: row.style,
            voice: row.voice,
            language: row.language,
            duration: row.duration
        }));
    } catch (err) {
        console.error('❌ Error fetching exported videos with joins:', err);
        throw err;
    }
}

async function updateSegmentsForVideo(videoId, segmentsData) {
    if (!videoId || !Array.isArray(segmentsData)) {
        throw new Error('Missing videoId or segmentsData must be an array.');
    }

    try {

        await db.delete(segments).where(eq(segments.video_id, videoId));


        const formattedSegments = await Promise.all(
            segmentsData.map(async (segment, index) => {
                const audioUrl = typeof segment.audio_url?.then === 'function'
                    ? await segment.audio_url
                    : segment.audio_url;

                return {
                    video_id: videoId,
                    segment_index: Number.isInteger(segment.segment_index) ? segment.segment_index : index,
                    text: segment.text ?? '',
                    audio_text: segment.audio_text ?? null,
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

        await db.insert(segments).values(formattedSegments);

    } catch (err) {
        console.error('❌ Failed to update segments:', err);
        throw err;
    }
}

async function softDeleteVideo(videoId) {
    const now = new Date();
    await db.update(videos).set({ deleted_at: now, status: 'deleted' }).where(eq(videos.id, videoId));
}

module.exports = {
    createVideo,
    insertSegments,
    updateExportVideoUrl,
    updateYoutubeUrl,
    getSegmentsByVideoId,
    getPreviewVideosWithFirstSegment,
    getExportedVideos,
    getAllSegmentsByVideoId,
    updateSegmentsForVideo,
    updateUpdatedAt,
    softDeleteVideo
};
