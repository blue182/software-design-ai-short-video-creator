// File: config/schema/index.js
const { voices } = require('./voices');
const { styles } = require('./styles');
const { languages } = require('./languages');
const { durations } = require('./durations');
const { users } = require('./users');
const { videos } = require('./videos');
const { segments } = require('./segments');

module.exports = {
    voices,
    styles,
    languages,
    durations,
    users,
    videos,
    segments,
};
