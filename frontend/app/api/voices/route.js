// app/api/voices/route.js
import { getAllVoices } from '@/lib/db/voices';

export async function GET() {
    try {
        const result = await getAllVoices();
        return Response.json(result);
    } catch (err) {
        console.error('❌ Failed to load voices:', err);
        return new Response(JSON.stringify({ error: 'Failed to load voices' }), {
            status: 500,
        });
    }
}