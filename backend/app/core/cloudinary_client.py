# backend/app/core/cloudinary_client.py
import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def upload_file(file_path: str, resource_type: str = "auto", folder: str = "ai-short-video-creator") -> str:
    """
    Upload file lên Cloudinary và trả về URL.
    
    :param file_path: Đường dẫn file local
    :param resource_type: Loại file (auto, image, video, raw)
    :param folder: Thư mục lưu trên Cloudinary
    :return: URL file trên Cloudinary
    """
    folder = "ai-short-video-creator/" + folder 
    result = cloudinary.uploader.upload(
        file_path,
        resource_type=resource_type,
        folder=folder
    )
    return result["secure_url"]