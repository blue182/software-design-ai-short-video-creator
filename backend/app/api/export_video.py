from fastapi import APIRouter, HTTPException
from ..services.video.video_renderer import generate_video_from_segments
from ..schemas.export_schema import ExportRequest,  ExportResponse

router = APIRouter()


@router.post("/", response_model=dict)
async def export_video(request: ExportRequest):
    print("Received export video request")

    data = request.segments
    id_cloud = request.id_cloud
    print(f"Exporting video with id_cloud: {id_cloud}")
    # print(f"Request data: {request.model_dump()}")
    video_size = request.video_size or { "aspect": "9:16", "width": 720, "height": 1280 }
    VIDEO_WIDTH = video_size['width']
    VIDEO_HEIGHT = video_size['height']
    print(f"Video size: {VIDEO_WIDTH}x{VIDEO_HEIGHT}")
    
    url_video = generate_video_from_segments(data, id_cloud, VIDEO_WIDTH=VIDEO_WIDTH, VIDEO_HEIGHT=VIDEO_HEIGHT)
    print("\n\nVideo URL:", url_video)



    video_script_response = ExportResponse(
        id_cloud=id_cloud,
        video_url=url_video
    )


    try:
        # Here you would call your video generation logic
        # For now, we return a mock response
        response = {
            "code": 200,
            "message": "Video generated successfully",
            "data": video_script_response.model_dump(),
        }
        return response
    except Exception as e:
        print("Error generating video:", str(e))
        raise HTTPException(status_code=500, detail=f"Video generation error: {str(e)}")