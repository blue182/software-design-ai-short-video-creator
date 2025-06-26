// File: config/schema/videos.js
import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { voices } from './voices';
import { styles } from './styles';
import { languages } from './languages';
import { durations } from './durations';

export const videos = pgTable('videos', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    title: text('title'),
    topic: text('topic'),
    styleId: integer('style_id').references(() => styles.id),
    voiceId: integer('voice_id').references(() => voices.id),
    languageId: integer('language_id').references(() => languages.id),
    durationId: integer('duration_id').references(() => durations.id),
    status: varchar('status', { length: 20 }),
    previewVideoUrl: text('preview_video_url'),
    finalVideoUrl: text('final_video_url'),
    backgroundMusicUrl: text('background_music_url'),
    createdAt: timestamp('created_at').defaultNow(),
});
