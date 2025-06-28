// lib/db/styles.js
const { db } = require('../../configs/db.js');
const { styles } = require('../../configs/schemas/styles.js');

async function getAllStyles() {
    return await db.select().from(styles);
}


module.exports = {
    getAllStyles,
};