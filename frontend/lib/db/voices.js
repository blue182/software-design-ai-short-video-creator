// lib/db/voices.js
const { db } = require('../../configs/db.js');
const { voices } = require('../../configs/schemas/voices.js');

async function getAllVoices() {
    return await db.select().from(voices);
}

module.exports = {
    getAllVoices,
};