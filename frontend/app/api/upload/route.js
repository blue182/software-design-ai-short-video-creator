import { uploadToCloudFolder, deleteCloudinaryFileByUrl } from '@/lib/cloudinary';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const id_cloud = formData.get('id_cloud');
        const oldUrl = formData.get('oldUrl');
        const type = formData.get('type') || 'image';

        if (!file || !id_cloud) {
            return new Response(JSON.stringify({ error: 'Missing file or id_cloud' }), { status: 400 });
        }

        if (oldUrl) {
            await deleteCloudinaryFileByUrl(id_cloud, oldUrl, type);
        }

        const uploadedUrl = await uploadToCloudFolder(file, id_cloud, type);

        if (!uploadedUrl) {
            throw new Error('Upload failed');
        }

        return Response.json({ url: uploadedUrl });

    } catch (error) {
        console.error('❌ Upload handler error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), { status: 500 });
    }
}
