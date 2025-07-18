import os
import uuid
import numpy as np
from moviepy.editor import ImageClip, AudioFileClip, CompositeVideoClip
from moviepy.video.fx.all import fadein, fadeout
from app.core.cloudinary_client import upload_file
from .subtitle_image import generate_subtitle_image
from moviepy.editor import vfx
from moviepy.editor import ColorClip, CompositeVideoClip
import requests 
import random

FADE_DURATION = 0.5
TEMP_DIR = "temp"

SUPPORTED_ANIMATIONS = [
    "zoom-in",
    "zoom-out",
    "slide-left",
    "slide-right",
    "slide-up",
    "slide-down",
    "fade"
]


def download_image_to_temp(url, filename=None):
    os.makedirs(TEMP_DIR, exist_ok=True)
    if not filename:
        filename = f"{uuid.uuid4()}.jpg"
    path = os.path.join(TEMP_DIR, filename)
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(path, "wb") as f:
            f.write(response.content)
        return path
    except Exception as e:
        print(f"[Error] Failed to download image from {url}: {e}")
        raise

def apply_animation(clip, animation, duration, VIDEO_SIZE=(720, 1280)):
    W, H = VIDEO_SIZE
    IN_DURATION = FADE_DURATION
    OUT_DURATION = FADE_DURATION

    # Apply fade effect by default
    clip = clip.fx(fadein, IN_DURATION).fx(fadeout, OUT_DURATION)

    # Animation by MoviePy built-in transform
    if animation == "zoom-in":
        # Từ 1.0 (gốc) ➝ 1.2 (phóng to dần)
        clip = clip.resize(lambda t: 1.0 + 0.2 * (t / duration))
        clip = clip.set_position("center")

    elif animation == "zoom-out":
        # Từ 1.2 ➝ 1.0 (thu nhỏ dần)
        clip = clip.resize(lambda t: 1.2 - 0.2 * (t / duration))
        clip = clip.set_position("center")

    elif animation == "slide-left":
        clip = clip.set_position(lambda t: (W * (1 - t / duration), 'center'))
    elif animation == "slide-right":
        clip = clip.set_position(lambda t: (-W * (1 - t / duration), 'center'))
    elif animation == "slide-up":
        clip = clip.set_position(lambda t: ('center', H * (1 - t / duration)))
    elif animation == "slide-down":
        clip = clip.set_position(lambda t: ('center', -H * (1 - t / duration)))
    elif animation == "fade":
        background = ColorClip(size=clip.size, color=(255,255,255), duration=clip.duration)
        clip = CompositeVideoClip([background, clip.set_position("center")])
        clip = fadein(clip, IN_DURATION).fx(fadeout, OUT_DURATION)
    else:
        clip = clip.set_position(("center", "center"))

    return clip


def resize_and_crop_center(image_path, duration, VIDEO_SIZE):
    clip = ImageClip(image_path)
    iw, ih = clip.size
    vw, vh = VIDEO_SIZE

    scale = max(vw / iw, vh / ih)  # scale sao cho ảnh phủ toàn bộ video
    scaled_clip = clip.resize(scale)
    return (
        scaled_clip
        .crop(
            x_center=scaled_clip.w // 2,
            y_center=scaled_clip.h // 2,
            width=vw,
            height=vh
        )
        .set_duration(duration)
    )



# ==== MAIN SEGMENT TO CLIP FUNCTION ====
def create_clip_from_segment(segment, index=0, upload_single=False, render_id=None, upload_fn=None, VIDEO_WIDTH=720, VIDEO_HEIGHT=1280):
    os.makedirs(TEMP_DIR, exist_ok=True)
    upload_fn = upload_fn or upload_file

    image_path = segment["image_url"]
    if image_path.startswith("http"):
        image_path = download_image_to_temp(image_path)

    audio_path = segment["audio_url"]
    subtitle = segment.get("text", "")
    duration = segment["duration"]
    animation = segment.get("animation", "")
    if not animation or animation not in SUPPORTED_ANIMATIONS:
        animation = random.choice(SUPPORTED_ANIMATIONS)

    subtitle_enabled = segment.get("subtitle_enabled", False)

    if subtitle_enabled:
        subtitle_color = segment.get("subtitle_color", "white")
        subtitle_bg = segment.get("subtitle_bg", "rgba(0,0,0,0.5)")
        font_size = segment.get("font_size", 24)
        text_styles = segment.get("text_styles", [])
        stroke_color = segment.get("stroke_color", "black")
        stroke_width = segment.get("stroke_width", 2)
        space_bottom = segment.get("space_bottom", 20)

    VIDEO_SIZE = (VIDEO_WIDTH, VIDEO_HEIGHT)


    audio = AudioFileClip(audio_path).subclip(0, min(duration, AudioFileClip(audio_path).duration))
    # raw_clip = ImageClip(image_path).set_duration(duration).resize(height=VIDEO_SIZE[1])
    # raw_clip = (
    #     ImageClip(image_path)
    #     .resize(width=VIDEO_SIZE[0] * 1.2)  # hoặc bất kỳ tỉ lệ scale nào
    #     .resize(height=VIDEO_SIZE[1] * 1.2)
    #     .crop(
    #         x_center=VIDEO_SIZE[0] // 2,
    #         y_center=VIDEO_SIZE[1] // 2,
    #         width=VIDEO_SIZE[0],
    #         height=VIDEO_SIZE[1]
    #     )
    #     .set_duration(duration)
    # )

    raw_clip = resize_and_crop_center(image_path, duration, VIDEO_SIZE)


    animated_clip = apply_animation(raw_clip, animation, duration, VIDEO_SIZE=VIDEO_SIZE)
    img_clip = animated_clip


    clips = [img_clip]

    if subtitle_enabled and subtitle:
        subtitle_img_path = os.path.join(TEMP_DIR, f"subtitle_{uuid.uuid4()}.png")
        generate_subtitle_image(
            text=subtitle,
            output_path=subtitle_img_path,
            text_color=subtitle_color,
            bg_color=subtitle_bg,
            font_size=font_size,
            text_styles=text_styles,
            stroke_color=stroke_color,
            stroke_width=stroke_width,
            VIDEO_SIZE=VIDEO_SIZE,
            space_bottom=space_bottom
        )

        subtitle_clip = ImageClip(subtitle_img_path).set_duration(duration)
        subtitle_clip = subtitle_clip.set_position(("center", VIDEO_SIZE[1] - 200))
        subtitle_clip = fadein(subtitle_clip, FADE_DURATION).fx(fadeout, FADE_DURATION)
        clips.append(subtitle_clip)

    final_clip = CompositeVideoClip(clips, size=VIDEO_SIZE).set_audio(audio)

    if upload_single and upload_fn and render_id:
        video_path = os.path.join(TEMP_DIR, f"single_{uuid.uuid4()}.mp4")
        final_clip.write_videofile(video_path, fps=24, audio_codec="aac")
        return upload_fn(video_path, folder=f"{render_id}/preview", resource_type="video")

    return final_clip
