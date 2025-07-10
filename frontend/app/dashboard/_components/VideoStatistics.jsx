import React from 'react'
import { ListVideosContext } from "@/app/_contexts/ListVideosContext";

function VideoStatistics({ loading }) {
    const { listVideos, setListVideos } = React.useContext(ListVideosContext);
    if (loading) {
        return null;
    }
    return (
        <div className="w-full mb-6 flex justify-center items-center gap-4 flex-wrap mt-10">
            {/* Exported */}
            <div className="flex items-center gap-4 p-4">
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">🎬</p>
                <div className="flex flex-col gap-0">
                    <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary pb-0">
                        {(listVideos?.listVideoExported?.length > 0 &&
                            listVideos?.listVideoExported?.length < 10)
                            ? String(listVideos?.listVideoExported?.length).padStart(2, '0')
                            : listVideos?.listVideoExported?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">Exported Videos</p>
                </div>
            </div>

            {/* Drafts */}
            <div className="flex items-center gap-4 p-4">
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">📝</p>
                <div className="flex flex-col gap-0">
                    <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary pb-0">
                        {(listVideos?.listVideoPreview?.length > 0 &&
                            listVideos?.listVideoPreview?.length < 10)
                            ? String(listVideos?.listVideoPreview?.length).padStart(2, '0')
                            : listVideos?.listVideoPreview?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">Draft Videos</p>
                </div>
            </div>
        </div>
    )
}

export default VideoStatistics