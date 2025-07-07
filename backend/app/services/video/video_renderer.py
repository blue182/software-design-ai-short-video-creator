import os
import uuid
import shutil
from moviepy.editor import concatenate_videoclips
from app.core.cloudinary_client import upload_file

from .clip_generator import create_clip_from_segment

TEMP_DIR = "temp"

def generate_video_from_segments(segments, render_id, upload_fn=None):
    upload_fn = upload_fn or upload_file
    os.makedirs(TEMP_DIR, exist_ok=True)
    output_video_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.mp4")

    clips = []
    for idx, segment in enumerate(segments):
        clip = create_clip_from_segment(segment, index=idx)
        clips.append(clip)

    final_video = concatenate_videoclips(clips, method="compose")
    final_video.write_videofile(output_video_path, fps=24)

    video_url = upload_fn(output_video_path, folder=f"{render_id}/video", resource_type="video")
    shutil.rmtree(TEMP_DIR, ignore_errors=True)
    return video_url
