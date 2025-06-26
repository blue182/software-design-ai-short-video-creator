// app/api/user/check-or-create/route.js
import { getUserByEmail, createUser } from '@/lib/db/user';

export async function POST(req) {
    const { email, username, avatar_url } = await req.json();

    if (!email) {
        return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
    }

    const existing = await getUserByEmail(email);

    if (!existing) {
        await createUser({ email, username, avatar_url });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
