// utils/parseVideoSize.js

function parseVideoSize(input) {
    try {
        if (!input) return {};

        if (typeof input === 'string') {
            return JSON.parse(input);
        }

        if (typeof input === 'object') {
            return input;
        }

        return {};
    } catch (error) {
        console.warn("⚠️ parseVideoSize(): Failed to parse input:", input, error);
        return {};
    }
}

export default parseVideoSize;
