
import { deleteCloudinaryFileByUrl } from '@/lib/cloudinary';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const id_cloud = formData.get('id_cloud');
        const audio_text = formData.get('audio_text');
        const oldUrl = formData.get('oldUrl');
        const voice = formData.get('voice') || 'default';
        const duration = formData.get('duration') || 'short';
        const index = formData.get('index') || 0;


        if (!id_cloud || !audio_text) {
            return new Response(JSON.stringify({ error: 'Missing id_cloud or audio_text' }), { status: 400 });
        }

        if (oldUrl) {
            await deleteCloudinaryFileByUrl(id_cloud, oldUrl, 'audio');
        }

        const aiForm = new FormData();
        aiForm.append('folder', id_cloud);
        aiForm.append('audio_text', audio_text);
        aiForm.append('voice', voice);
        aiForm.append('duration', duration);
        aiForm.append('index', index);

        // console.log('Sending request to AI service with form data:', {
        //     id_cloud,
        //     audio_text,
        //     voice,
        //     duration,
        //     index,
        // });

        // Gửi yêu cầu đến AI service
        const aiRes = await fetch(`${process.env.SERVICE_AI_URL}audio/generate`, {
            method: 'POST',
            body: aiForm,
        });

        if (!aiRes.ok) {
            const errorText = await aiRes.text();
            return new Response(JSON.stringify({ error: 'AI service error', detail: errorText }), { status: 500 });
        }

        const aiData = await aiRes.json();


        if (!aiData.audio_segment.url) {
            return new Response(JSON.stringify({ error: 'No audio URL returned from AI service' }), { status: 500 });
        }

        return new Response(JSON.stringify({ url: aiData.audio_segment.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error generating AI audio:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}