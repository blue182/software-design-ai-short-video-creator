// app/api/languages/route.js
import { getAllLanguages } from '@/lib/db/languages';

export async function GET() {
    try {
        const result = await getAllLanguages();
        return Response.json(result);
    } catch (err) {
        console.error('❌ Failed to load languages:', err);
        return new Response(JSON.stringify({ error: 'Failed to load languages' }), {
            status: 500,
        });
    }
}