// app/api/styles/route.js
import { getAllStyles } from '@/lib/db/styles';

export async function GET() {
    try {
        const result = await getAllStyles();
        return Response.json(result);
    } catch (err) {
        console.error('❌ Failed to load styles:', err);
        return new Response(JSON.stringify({ error: 'Failed to load styles' }), {
            status: 500,
        });
    }
}
