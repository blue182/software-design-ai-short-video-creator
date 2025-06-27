// app/api/durations/route.js
import { getAllDurations } from '@/lib/db/durations';

export async function GET() {
    try {
        const result = await getAllDurations();
        return Response.json(result);
    } catch (err) {
        console.error('❌ Failed to load durations:', err);
        return new Response(JSON.stringify({ error: 'Failed to load durations' }), {
            status: 500,
        });
    }
}