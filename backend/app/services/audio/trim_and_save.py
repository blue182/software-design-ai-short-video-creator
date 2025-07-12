import os
import tempfile
import subprocess
from fastapi import UploadFile
from pydub import AudioSegment
import imageio_ffmpeg
from app.core.cloudinary_client import upload_file


def read_mp3_without_ffprobe(mp3_bytes: bytes) -> AudioSegment:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_input:
        temp_input.write(mp3_bytes)
        temp_input.flush()
        temp_input_path = temp_input.name

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_output:
        temp_output_path = temp_output.name

    try:
        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        result = subprocess.run(
            [ffmpeg_path, "-y", "-i", temp_input_path, temp_output_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        if result.returncode != 0:
            error_msg = result.stderr.decode()
            raise RuntimeError(f"FFmpeg failed with error: {error_msg}")

        if not os.path.exists(temp_output_path) or os.path.getsize(temp_output_path) == 0:
            raise RuntimeError("WAV file is missing or empty after ffmpeg conversion")

        audio = AudioSegment.from_file(temp_output_path, format="wav")
        return audio

    finally:
        os.remove(temp_input_path)
        if os.path.exists(temp_output_path):
            os.remove(temp_output_path)


async def trim_and_upload_audio(
    file: UploadFile,
    start: float,
    end: float,
    id_cloud: str,
) -> str:
    export_path = None

    try:
        original_bytes = await file.read()
        if not original_bytes:
            raise ValueError("Uploaded file is empty.")

        audio = read_mp3_without_ffprobe(original_bytes)

        trimmed_audio = audio[int(start * 1000): int(end * 1000)]

        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as out_file:
            trimmed_audio.export(out_file.name, format="mp3")
            export_path = out_file.name

        url = upload_file(
            export_path,
            resource_type="video",  # vì Cloudinary xử lý audio như video
            folder=f"{id_cloud}/audio"
        )
        print("✅ [Success] Trim & Upload completed successfully.")
        return url

    except Exception as e:
        print("❌ [Error] Trim & Upload failed:", e)
        raise RuntimeError(f"Trim error: {e}")

    finally:
        if export_path and os.path.exists(export_path):
            os.remove(export_path)
            print("🧹 [Cleanup] Temp export file deleted.")
