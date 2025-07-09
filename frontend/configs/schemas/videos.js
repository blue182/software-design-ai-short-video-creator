// File: config/schema/videos.js
const { pgTable, serial, integer, text, varchar, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { styles } = require('./styles');
const { voices } = require('./voices');
const { languages } = require('./languages');
const { durations } = require('./durations');



const videos = pgTable('videos', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id),
    title: text('title'),
    topic: text('topic'),
    style_id: integer('style_id').references(() => styles.id),
    voice_id: integer('voice_id').references(() => voices.id),
    language_id: integer('language_id').references(() => languages.id),
    duration_id: integer('duration_id').references(() => durations.id),
    status: varchar('status', { length: 20 }), // e.g., 'pending', 'processing', 'completed', 'failed', "deleted"
    export_video_url: text('export_video_url'),
    background_music_url: text('background_music_url'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp('deleted_at'),
    id_cloud: text('id_cloud'),
    video_size: text('video_size'), // e.g., '{"aspect": "9:16", "width": 720, "height": 1280}'
    ytb_url: text('ytb_url'), // YouTube URL if applicable
});

module.exports = { videos };