// File: config/schema/segments.js
import { pgTable, serial, integer, text, doublePrecision } from 'drizzle-orm/pg-core';
import { videos } from './videos';

export const segments = pgTable('video_segments', {
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
