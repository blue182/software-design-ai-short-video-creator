// drizzle.config.js
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
    dialect: "postgresql",
    schema: "./configs/schemas",                // folder containing schema files
    out: "./drizzle/migrations",              // folder to store migration files
    dbCredentials: {
        url: 'postgresql://Ai-Short-Video-Creator_owner:npg_8fKp4XQNuUkP@ep-calm-fog-a82c9dza-pooler.eastus2.azure.neon.tech/Ai-Short-Video-Creator?sslmode=require&channel_binding=require',
    },
});
