// lib/db/durations.js
const { db } = require('../../configs/db.js');
const { durations } = require('../../configs/schemas/durations.js');

async function getAllDurations() {
    return await db.select().from(durations);
}

module.exports = {
    getAllDurations,
};