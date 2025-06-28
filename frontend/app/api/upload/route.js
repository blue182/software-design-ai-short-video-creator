import cloudinary from '@/lib/cloudinary';

export async function POST(req) {
    const data = await req.formData();
    const file = data.get('file'); // 👈 file từ client

    if (!file) {
        return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
        const res = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'styles' }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }).end(buffer);
        });

        return Response.json({ url: res.secure_url });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
    }
}
