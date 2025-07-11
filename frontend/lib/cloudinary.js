const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { v4: uuidv4 } = require('uuid');


async function deleteCloudinaryFileByUrl(id_cloud, fileUrl, resourceType = 'image') {
    try {
        const url = new URL(fileUrl);
        const pathname = url.pathname; // /.../upload/v1234/ai-short-video-creator/abc123/image/file.jpg
        const pathWithoutSlash = pathname.startsWith('/') ? pathname.slice(1) : pathname;
        const pathParts = pathWithoutSlash.split('/');

        const folderName = resourceType === 'audio' ? 'audio' : 'image';
        const expectedPath = `ai-short-video-creator/${id_cloud}/${folderName}`;

        const pathString = pathParts.join('/');
        if (!pathString.includes(expectedPath)) {
            throw new Error(`URL not in expected folder: ${expectedPath}`);
        }

        // Lấy public_id (bắt đầu sau `upload/`)
        const publicIdWithExt = pathParts.slice(pathParts.indexOf('upload') + 1).join('/');
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // bỏ extension

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        return result.result === 'ok' || result.result === 'not_found';
    } catch (err) {
        console.error('❌ Error deleting Cloudinary file:', err.message);
        return false;
    }
}

/**
 * ✅ Upload file lên folder image hoặc audio tương ứng
 */
async function uploadToCloudFolder(file, id_cloud, resourceType = 'image') {
    return new Promise((resolve, reject) => {
        try {
            const folderName = resourceType === 'audio' ? 'audio' : 'images';
            const publicId = `ai-short-video-creator/${id_cloud}/${folderName}/${uuidv4()}`;

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `ai-short-video-creator/${id_cloud}/${folderName}`,
                    public_id: uuidv4(),
                    resource_type: resourceType,
                    overwrite: true,
                },
                (error, result) => {
                    if (error) {
                        console.error('❌ Upload error:', error);
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );

            // Convert Blob to Buffer and pipe to uploadStream
            file.arrayBuffer().then((arrayBuffer) => {
                const buffer = Buffer.from(arrayBuffer);
                const stream = require('stream');
                const readable = new stream.PassThrough();
                readable.end(buffer);
                readable.pipe(uploadStream);
            });
        } catch (err) {
            console.error('❌ Unexpected error in uploadToCloudFolder:', err);
            reject(err);
        }
    });
}



module.exports = {
    cloudinary,
    deleteCloudinaryFileByUrl,
    uploadToCloudFolder,
};
