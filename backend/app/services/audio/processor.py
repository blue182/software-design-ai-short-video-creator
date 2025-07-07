# app/services/audio/processor.py
import tempfile
import os
import subprocess
import imageio_ffmpeg
from pydub import AudioSegment

def adjust_audio_to_duration(audio: AudioSegment, target_duration: float) -> AudioSegment:
    current_duration = len(audio) / 1000  # giây

    if abs(current_duration - target_duration) < 0.05:
        return audio  # đủ gần rồi

    if current_duration > target_duration:
        # 👉 Audio quá dài → tăng tốc để rút ngắn lại
        speed_ratio = current_duration / target_duration

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_in:
            audio.export(tmp_in.name, format="wav")
            tmp_in_path = tmp_in.name

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_out:
            tmp_out_path = tmp_out.name

        filters = []
        while speed_ratio > 2.0:
            filters.append("atempo=2.0")
            speed_ratio /= 2.0
        filters.append(f"atempo={speed_ratio:.4f}")
        filter_str = ",".join(filters)

        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run(
            [ffmpeg_path, "-y", "-i", tmp_in_path, "-filter:a", filter_str, tmp_out_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        new_audio = AudioSegment.from_file(tmp_out_path, format="wav")

        os.remove(tmp_in_path)
        os.remove(tmp_out_path)

        return new_audio

    else:
        # 👉 Audio quá ngắn → thêm khoảng lặng phía sau
        padding_duration_ms = int((target_duration - current_duration) * 1000)
        silence = AudioSegment.silent(duration=padding_duration_ms)
        return audio + silence
