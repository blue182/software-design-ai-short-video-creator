import { NextResponse } from 'next/server';

export async function POST(req) {
    console.log('[API] 🔔 Gọi API /api/audio/trim');

    try {
        // Parse multipart/form-data
        const formData = await req.formData();
        console.log('[API] ✅ Đã nhận formData');

        const file = formData.get('file');
        const start = formData.get('start');
        const end = formData.get('end');
        const duration = formData.get('duration');
        const id_cloud = formData.get('id_cloud');

        console.log('[API] 📦 Các giá trị nhận được:', {
            fileType: file?.type,
            fileSize: file?.size,
            start,
            end,
            duration,
            id_cloud,
        });

        if (!file || !start || !end || !id_cloud) {
            console.warn('[API] ❌ Thiếu trường bắt buộc');
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const aiForm = new FormData();
        aiForm.set('file', file);
        aiForm.set('start', start);
        aiForm.set('end', end);
        aiForm.set('duration', duration || '0');
        aiForm.set('id_cloud', id_cloud);

        const aiURL = `${process.env.SERVICE_AI_URL}audio/trim`;
        console.log('[API] 🔄 Gửi request tới AI service:', aiURL);

        const aiRes = await fetch(aiURL, {
            method: 'POST',
            body: aiForm,
        });

        console.log('[API] 📥 Phản hồi từ AI service:', aiRes.status);

        if (!aiRes.ok) {
            const errText = await aiRes.text();
            console.error('[API] ❌ AI service lỗi:', errText);
            return NextResponse.json(
                { error: 'AI service failed', detail: errText },
                { status: 500 }
            );
        }

        const result = await aiRes.json();
        console.log('[API] ✅ AI xử lý thành công:', result);

        return NextResponse.json({ url: result.url });
    } catch (err) {
        console.error('[API] ❌ Lỗi xử lý:', err);
        return NextResponse.json(
            { error: 'Server error', detail: err.message },
            { status: 500 }
        );
    }
}
