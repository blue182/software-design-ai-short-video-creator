import { ListVideosContext } from '@/app/_contexts/ListVideosContext';
import React, { useState } from 'react';
import formatDateTime from '@/helpers/format-date';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import VideoExportDetail from './VideoExportDetail';
import ConfirmDeleteAlert from '@/components/ConfirmDeleteAlert';
import { MoreVerticalIcon } from 'lucide-react';


function ListVideosExported() {
    const { listVideos, setListVideos } = React.useContext(ListVideosContext);
    const videos = listVideos?.listVideoExported || [];
    const [selectedVideo, setSelectedVideo] = useState(null);


    if (!videos || videos.length === 0) {
        return (
            <div className="text-center text-gray-500">
                <p>No exported videos available.</p>
            </div>
        );
    }

    console.log("📹 List Videos Exported:", videos);

    const handleClick = (video) => {
        setSelectedVideo(video);
        console.log("🔍 Selected video:", video);
    };

    return (
        <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {videos.map((video, index) => (
                    <div
                        key={index}
                        className="group border rounded-lg overflow-hidden shadow hover:shadow-lg relative 
                            hover:scale-105 transition-all duration-300 cursor-pointer "

                    >
                        <div className="overflow-hidden">
                            <ConfirmDeleteAlert
                                videoId={video.id}
                                onDeleted={() => {

                                    const updatedList = videos.filter(v => v.id !== video.id);
                                    setListVideos(prev => ({
                                        ...prev,
                                        listVideoExported: updatedList,
                                    }));
                                }}
                            />

                            <video
                                src={video.export_video_url}
                                controls
                                muted
                                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        {/* <div className="p-2" onClick={() => handleClick(video)}>
                            <div  >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <h3 className="text-lg font-semibold truncate cursor-help">
                                                {video.title}
                                            </h3>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="center">
                                            <p className="max-w-xs">{video.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <p className="text-sm text-gray-600">
                                    Duration: {video.duration?.seconds || "Unknown"}s
                                </p>
                                <p className="text-sm text-gray-600">
                                    Export at: {formatDateTime(video?.updated_at)}
                                </p>
                            </div>


                        </div> */}

                        <div className="p-2 relative" onClick={() => handleClick(video)}>
                            {/* Nút ba chấm ở góc phải */}
                            <div
                                className="absolute top-2 right-2 z-10"
                                onClick={(e) => e.stopPropagation()} // Ngăn mở chi tiết khi bấm nút này
                            >
                                <ConfirmDeleteAlert
                                    videoId={video.id}
                                    trigger={
                                        <button className="p-1 hover:bg-gray-200 rounded-full">
                                            <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                                        </button>
                                    }
                                    onDeleted={() => {
                                        const updatedList = videos.filter(v => v.id !== video.id);
                                        setListVideos(prev => ({
                                            ...prev,
                                            listVideoExported: updatedList,
                                        }));
                                    }}
                                />
                            </div>

                            {/* Nội dung thông tin video */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <h3 className="text-lg font-semibold truncate cursor-help pr-6">
                                            {video.title}
                                        </h3>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center">
                                        <p className="max-w-xs">{video.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <p className="text-sm text-gray-600">
                                Duration: {video.duration?.seconds || "Unknown"}s
                            </p>
                            <p className="text-sm text-gray-600">
                                Export at: {formatDateTime(video?.updated_at)}
                            </p>
                        </div>

                    </div>

                ))}
            </div>

            {selectedVideo && (
                <VideoExportDetail selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />
            )}
        </div>
    );
}

export default ListVideosExported;
