// app/api/user/check-or-create/route.js
import { getUserByEmail, createUser } from '@/lib/db/user';

export async function POST(req) {
    const { email, username, avatar_url, clerk_id } = await req.json();

    if (!email) {
        return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
        return new Response(JSON.stringify({ ok: true, user: existing }), { status: 200 });
    }

    const createdUser = await createUser({ email, username, avatar_url, clerk_id });
    if (!createdUser) {
        return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, user: createdUser }), { status: 201 });


}
