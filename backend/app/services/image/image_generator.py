
import os
import tempfile
import torch
import gc
import asyncio
from PIL import Image
from app.core.cloudinary_client import upload_file
from diffusers import StableDiffusionPipeline

# ==== Cấu hình mặc định ====
DEFAULT_WIDTH = 1080
DEFAULT_HEIGHT = 1600
MAX_CONCURRENT_RENDER = 2  # 👈 Tối đa ảnh render song song

# ==== Khởi tạo pipeline ====
pipe = StableDiffusionPipeline.from_pretrained(
    "Lykon/dreamshaper-8",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)
pipe.to("cuda" if torch.cuda.is_available() else "cpu")

try:
    if torch.cuda.is_available():
        pipe.unet = torch.compile(pipe.unet)
except Exception as e:
    print("[⚠️] Không thể compile UNet:", e)

# Tắt safety checker nếu muốn tăng tốc
def dummy_safety_checker(images, clip_input):
    return images, [False] * len(images)

pipe.safety_checker = dummy_safety_checker


# ==== Semaphore để giới hạn ảnh render song song ====
semaphore = asyncio.Semaphore(MAX_CONCURRENT_RENDER)


# ==== Hàm render + upload 1 ảnh ====
async def render_single_image(segment: dict, folder: str) -> dict:
    prompt = segment.get("description_image")
    if not prompt:
        raise ValueError(f"❌ Missing 'description_image' in segment {segment['segment_index']}")

    width = segment.get("width", DEFAULT_WIDTH)
    height = segment.get("height", DEFAULT_HEIGHT)

    async with semaphore:
        with torch.inference_mode():
            image = pipe(prompt, num_inference_steps=25).images[0]
            image = image.resize((int(width), int(height)), resample=Image.LANCZOS)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
            tmp_path = tmp_file.name
            image.save(tmp_path)

        try:
            url = upload_file(tmp_path, resource_type="image", folder=f"{folder}/images")
            segment["image_url"] = url
        finally:
            os.remove(tmp_path)
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
    print(f"✅ Rendered and uploaded image for segment {segment['segment_index']}: {url}")

    return segment


# ==== Hàm chính để xử lý toàn bộ danh sách segment ====
async def generate_and_upload_images(segments: list, folder: str = "generated/images") -> list:
    tasks = [render_single_image(seg, folder) for seg in segments]
    updated_segments = await asyncio.gather(*tasks)
    return updated_segments


# import os
# import tempfile
# import asyncio
# import base64
# import gc
# from app.core.cloudinary_client import upload_file
# from together import Together
# from app.core.config import settings

# # ==== Cấu hình mặc định ====
# DEFAULT_WIDTH = 1080
# DEFAULT_HEIGHT = 1600
# MAX_CONCURRENT_RENDER = 2  # 👈 Tối đa ảnh render song song
# TOGETHER_MODEL = "black-forest-labs/FLUX.1-schnell-Free"
# TOGETHER_STEPS = 4

# # ==== Khởi tạo client Together ====
# client = Together(api_key=settings.TOGETHERAI_API_KEY, base_url="https://api.together.xyz")

# # ==== Semaphore để giới hạn ảnh render song song ====
# semaphore = asyncio.Semaphore(MAX_CONCURRENT_RENDER)


# # ==== Hàm render + upload 1 ảnh ====
# async def render_single_image(segment: dict, folder: str) -> dict:
#     prompt = segment.get("description_image")
#     if not prompt:
#         raise ValueError(f"\u274c Missing 'description_image' in segment {segment['segment_index']}")

#     width = segment.get("width", DEFAULT_WIDTH)
#     height = segment.get("height", DEFAULT_HEIGHT)

#     async with semaphore:
#         # Gọi Together để tạo ảnh (1 ảnh/lần)
#         response = client.images.generate(
#             prompt=prompt,
#             model=TOGETHER_MODEL,
#             steps=TOGETHER_STEPS,
#             n=1
#         )
#         print("🪵 RESPONSE:", response)
        
#         if not response.data or not response.data[0].b64_json:
#             raise ValueError(f"❌ Failed to generate image for prompt: {prompt}")


#         # Lấy base64 và chuyển thành ảnh
#         image_b64 = response.data[0].b64_json
#         image_data = base64.b64decode(image_b64)

#         with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
#             tmp_path = tmp_file.name
#             tmp_file.write(image_data)

#         try:
#             url = upload_file(tmp_path, resource_type="image", folder=f"{folder}/images")
#             segment["image_url"] = url
#         finally:
#             os.remove(tmp_path)
#             gc.collect()

#     print(f"\u2705 Rendered and uploaded image for segment {segment['segment_index']}: {url}")
#     return segment


# # ==== Hàm chính để xử lý toàn bộ danh sách segment ====
# async def generate_and_upload_images(segments: list, folder: str = "generated/images") -> list:
#     tasks = [render_single_image(seg, folder) for seg in segments]
#     updated_segments = await asyncio.gather(*tasks)
#     return updated_segments



# # if __name__ == "__main__":
# #     # Ví dụ sử dụng
# #     segments_example = [
# #         {"segment_index": 1, "description_image": "A beautiful sunset over the mountains"},
# #         {"segment_index": 2, "description_image": "A futuristic city skyline at night"}
# #     ]
    
# #     loop = asyncio.get_event_loop()
# #     updated_segments = loop.run_until_complete(generate_and_upload_images(segments_example))
    
# #     for seg in updated_segments:
# #         print(seg)