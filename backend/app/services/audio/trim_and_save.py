# app/services/audio/trim_and_save.py
import os
import tempfile
from fastapi import UploadFile
from pydub import AudioSegment

from app.core.cloudinary_client import upload_file
import subprocess
import imageio_ffmpeg


def read_mp3_without_ffprobe(mp3_bytes: bytes) -> AudioSegment:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_input:
        temp_input.write(mp3_bytes)
        temp_input.flush()
        temp_input_path = temp_input.name

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_output:
        temp_output_path = temp_output.name

    try:
        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run(
            [ffmpeg_path, "-i", temp_input_path, temp_output_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True
        )
        return AudioSegment.from_file(temp_output_path, format="wav")

    finally:
        if os.path.exists(temp_input_path):
            os.remove(temp_input_path)
        if os.path.exists(temp_output_path):
            os.remove(temp_output_path)


async def trim_and_upload_audio(
    file: UploadFile,
    start: float,
    end: float,
    id_cloud: str,
) -> str:
    try:
        # Đọc nội dung file upload
        original_bytes = await file.read()

        # Đọc AudioSegment từ bytes (không dùng ffprobe)
        audio = read_mp3_without_ffprobe(original_bytes)

        # Trim từ start → end (ms)
        trimmed_audio = audio[int(start * 1000): int(end * 1000)]

        # Ghi ra file tạm
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as out_file:
            trimmed_audio.export(out_file.name, format="mp3")
            export_path = out_file.name

        # Upload lên Cloudinary
        url = upload_file(
            export_path,
            resource_type="video",  # cloudinary xử lý audio như video
            folder=f"{id_cloud}/audio"
        )

        return url

    except Exception as e:
        print("❌ Trim & Upload failed:", e)
        raise RuntimeError(f"Trim error: {e}")

    finally:
        if 'export_path' in locals() and os.path.exists(export_path):
            os.remove(export_path)
