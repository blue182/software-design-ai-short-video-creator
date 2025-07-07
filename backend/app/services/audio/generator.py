# app/services/audio/generator.py
import asyncio
import tempfile
import os
from pydub import AudioSegment
import edge_tts
from app.core.cloudinary_client import upload_file
from .reader import read_mp3_without_ffprobe
from .processor import adjust_audio_to_duration

async def _generate_and_upload_segment(text: str, voice: str, index: int, folder: str, target_duration: float) -> dict:
    communicate = edge_tts.Communicate(text=text, voice=voice)
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmpfile:
        await communicate.save(tmpfile.name)
        tmp_path = tmpfile.name

    audio = read_mp3_without_ffprobe(tmp_path)
    adjusted_audio = adjust_audio_to_duration(audio, target_duration)

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as out_file:
        adjusted_audio.export(out_file.name, format="mp3")
        export_path = out_file.name

    try:
        url = upload_file(export_path, resource_type="video", folder=f"{folder}/audio")
    except Exception as e:
        raise RuntimeError(f"Upload failed for segment {index}: {e}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        if os.path.exists(export_path):
            os.remove(export_path)

    return {
        "segment_index": index,
        "url": url
    }

async def generate_audio_segments(segments: list, voice_code: str, folder: str) -> list:
    tasks = [
        _generate_and_upload_segment(
            seg["text"],
            voice_code,
            seg["segment_index"],
            folder,
            seg.get("duration", 3)
        )
        for seg in segments
    ]

    audio_urls = await asyncio.gather(*tasks)

    for result in audio_urls:
        for seg in segments:
            if seg["segment_index"] == result["segment_index"]:
                seg["audio_url"] = result["url"]
                break

    return segments
