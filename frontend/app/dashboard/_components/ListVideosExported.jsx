import { ListVideosContext } from '@/app/_contexts/ListVideosContext';
import React, { useState } from 'react';
import formatDateTime from '@/helpers/format-date'; // Ensure this path is correct
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import VideoExportDetail from './VideoExportDetail';


function ListVideosExported() {
    const { listVideos } = React.useContext(ListVideosContext);
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
                            <video
                                src={video.export_video_url}
                                controls
                                muted
                                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        <div className="p-2" onClick={() => handleClick(video)}>
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
