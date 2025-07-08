// File: config/schema/videos.js
const { pgTable, serial, integer, text, varchar, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { styles } = require('./styles');
const { voices } = require('./voices');
const { languages } = require('./languages');
const { durations } = require('./durations');



const videos = pgTable('videos', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    title: text('title'),
    topic: text('topic'),
    styleId: integer('style_id').references(() => styles.id),
    voiceId: integer('voice_id').references(() => voices.id),
    languageId: integer('language_id').references(() => languages.id),
    durationId: integer('duration_id').references(() => durations.id),
    status: varchar('status', { length: 20 }), // e.g., 'pending', 'processing', 'completed', 'failed', "deleted"
    finalVideoUrl: text('final_video_url'),
    backgroundMusicUrl: text('background_music_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp('deleted_at'),
    id_cloud: text('id_cloud'),
    video_size: text('video_size'), // e.g., '{"aspect": "9:16", "width": 720, "height": 1280}'
});

module.exports = { videos };