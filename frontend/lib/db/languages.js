// lib/db/languages.js
const { db } = require('../../configs/db.js');
const { languages } = require('../../configs/schemas/languages.js');

async function getAllLanguages() {
    return await db.select().from(languages);
}

module.exports = {
    getAllLanguages,
};