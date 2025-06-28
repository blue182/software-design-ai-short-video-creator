// lib/axios.js
const axios = require('axios');

const instance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

module.exports = instance;
