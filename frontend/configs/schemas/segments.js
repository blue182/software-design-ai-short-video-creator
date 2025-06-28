// File: config/schema/segments.js
const { pgTable, serial, integer, text, doublePrecision } = require('drizzle-orm/pg-core');
const { videos } = require('./videos'); // Assuming videos table is defined in videos.js

const segments = pgTable('video_segments', {
    id: serial('id').primaryKey(),
    videoId: integer('video_id').references(() => videos.id),
    segmentIndex: integer('segment_index'),
    text: text('text').notNull(),
    descriptionImage: text('description_image'),
    imageUrl: text('image_url'),
    voiceUrl: text('voice_url'),
    start_time: doublePrecision('start_time'),
    end_time: doublePrecision('end_time'),
});

module.exports = {
    segments
};
