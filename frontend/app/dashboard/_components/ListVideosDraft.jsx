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
import axios from 'axios';
import { useRouter } from 'next/navigation';


function ListVideosDraft() {
    const { listVideos } = React.useContext(ListVideosContext);
    const videos = listVideos?.listVideoPreview || [];
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    if (!videos || videos.length === 0) {
        return (
            <div className="text-center text-gray-500">
                <p>No exported videos available.</p>
            </div>
        );
    }

    // console.log("📹 List Videos Exported===========:", videos);

    const handleClick = async (video) => {
        setLoading(true);
        const videoId = video.id;
        console.log("🔍 Selected video:", videoId);
        const infoVideo = {
            id_cloud: video?.id_cloud,
            title: video?.title || '',
            languages: video?.language || null,
            topic: video?.topic || null,
            style: video?.style || null,
            voice: video?.voice || null,
            duration: video?.duration || null,
            video_url: video?.video_url || null,
            video_size: video?.video_size || { aspect: '9:16', width: 720, height: 1280 },
            created_at: video?.created_at || new Date().toISOString(),
            updated_at: video?.updated_at || new Date().toISOString(),
            status: video?.status || 'preview',
        };
        console.log("🔍 Video info:", infoVideo);


        try {
            const res = await axios.get(`/api/videos/get-segment-video?videoId=${videoId}`);
            const video_data = {
                id_cloud: video?.id_cloud || '',
                infoVideo: infoVideo,
                framesList: res.data || [],
                totalDuration: infoVideo.duration?.value || 0,
                videoId: videoId || '',
                title: infoVideo.title || 'Untitled Video',

            }
            localStorage.setItem('video_data', JSON.stringify(video_data));
            router.push('/editor');
        } catch (err) {
            console.error('❌ Failed to fetch segments:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {videos.map((video, index) => (
                    <div
                        key={index}
                        className="group border rounded-lg overflow-hidden shadow hover:shadow-lg relative 
                            hover:scale-105 transition-all duration-300 cursor-pointer "
                        onClick={() => handleClick(video)}
                    >
                        <div className="overflow-hidden">
                            <img
                                src={video?.firstSegment?.image_url}
                                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        <div className="p-2">
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
                                Last updated at: {formatDateTime(video?.updated_at)}
                            </p>
                        </div>
                    </div>

                ))}
            </div>

        </div>
    );
}

export default ListVideosDraft;
