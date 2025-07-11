import axios from 'axios';

/**
 * Upload file to Cloudinary via API route.
 * 
 * @param {File} file - File to upload
 * @param {string} idCloud - Cloud user/video ID
 * @param {string} type - 'image' | 'audio'
 * @param {string} [oldUrl] - Optional old file URL to delete
 * @returns {Promise<{ url: string, objectUrl: string }>} - Returns new Cloudinary URL + local preview URL
 */
export async function uploadMediaToCloudinary({ file, idCloud, type = 'image', oldUrl = '' }) {
    if (!file || !idCloud) throw new Error('Missing file or idCloud');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id_cloud', idCloud);
    formData.append('oldUrl', oldUrl);
    formData.append('type', type);

    const response = await axios.post('/api/upload', formData);

    if (!response.data?.url) {
        throw new Error('Upload failed or missing URL');
    }

    const cloudinaryUrl = response.data.url;

    return { url: cloudinaryUrl };
}
