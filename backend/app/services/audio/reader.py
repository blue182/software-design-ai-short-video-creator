# app/services/audio/reader.py
import subprocess
from io import BytesIO
import imageio_ffmpeg
from pydub.utils import which
from pydub import AudioSegment

# Đảm bảo ffmpeg đã được thiết lập
AudioSegment.converter = imageio_ffmpeg.get_ffmpeg_exe()
# AudioSegment.converter = which("ffmpeg") or "D:/Tool/ffmpeg/bin/ffmpeg.exe"

def read_mp3_without_ffprobe(mp3_path: str) -> AudioSegment:
    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
    process = subprocess.Popen(
        [ffmpeg_path, "-i", mp3_path, "-f", "wav", "-"],
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL
    )
    raw_audio = process.stdout.read()
    return AudioSegment.from_file(BytesIO(raw_audio), format="wav")
