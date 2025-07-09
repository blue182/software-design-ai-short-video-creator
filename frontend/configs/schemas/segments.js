// File: config/schema/segments.js
const { pgTable, serial, integer, text, doublePrecision, boolean } = require('drizzle-orm/pg-core');
const { videos } = require('./videos');
const { duration } = require('drizzle-orm/gel-core');

const segments = pgTable('video_segments', {
    id: serial('id').primaryKey(),
    video_id: integer('video_id').references(() => videos.id),
    segment_index: integer('segment_index'),
    text: text('text').notNull(),
    description_image: text('description_image'),
    image_url: text('image_url'),
    audio_url: text('audio_url'),
    start_time: doublePrecision('start_time'),
    end_time: doublePrecision('end_time'),
    duration: doublePrecision('duration').notNull(),
    animation: text('animation'),
    font_size: integer('font_size'),
    stroke_color: text('stroke_color'),
    stroke_width: integer('stroke_width'),
    subtitle_bg: text('subtitle_bg'),
    subtitle_color: text('subtitle_color'),
    subtitle_enabled: boolean('subtitle_enabled'),
    space_bottom: integer('space_bottom'),

    text_styles: text('text_styles'),
});

module.exports = {
    segments
};
