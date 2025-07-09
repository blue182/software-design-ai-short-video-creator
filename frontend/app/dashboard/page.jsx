"use client";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import { ListVideosContext } from "@/app/_contexts/ListVideosContext";
import { UserDetailContext } from "@/app/_contexts/UserDetailContext";
import ListVideosExported from "./_components/ListVideosExported";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { SquareScissors, Clapperboard } from "lucide-react";
import VideoListSkeleton from "./_components/VideoListSkeleton";
import ListVideosDraft from "./_components/ListVideosDraft";
import { VideoFrameContext } from "../_contexts/VideoFrameContext";

function Dashboard() {
    const { listVideos, setListVideos } = useContext(ListVideosContext);
    const { userDetail } = useContext(UserDetailContext);
    const [mode, setMode] = useState("exported");
    const [loading, setLoading] = useState(false);
    const { videoFrames, setVideoFrames } = useContext(VideoFrameContext);

    useEffect(() => {

        if (!userDetail || !userDetail.id) {
            console.warn("⚠️ User detail is not available yet.");
            return;
        }
        setLoading(true);

        const fetchVideos = async () => {
            try {
                const response = await axios.get("/api/videos/get-list-videos", {
                    params: { userId: userDetail.id },
                });

                const data = response.data;

                // console.log("📹 Fetched videos:", data);

                setListVideos({
                    listVideoExported: data.exported || [],
                    listVideoPreview: data.preview || [],
                });
            } catch (error) {
                console.error("❌ Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [userDetail, setListVideos]);

    // console.log("📹 List Videos:", listVideos);

    const hasNoVideos =
        listVideos?.listVideoExported?.length === 0 &&
        listVideos?.listVideoPreview?.length === 0;

    return (
        <div className="md:px-10 mt-5 px-5 py-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-primary-300 pb-4">
                <h2 className="font-bold text-base sm:text-base md:text-xl lg:text-2xl text-primary">Dashboard</h2>
                <Link href="/dashboard/create-new">
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap">
                        Create New Video
                    </button>
                </Link>
            </div>
            {loading ? (
                <VideoListSkeleton />
            ) : hasNoVideos ? (
                <EmptyState />
            ) : (
                loading ? (
                    <VideoListSkeleton />
                ) : (
                    <>
                        {/* Dashboard Stats */}
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

                        {/* ToggleGroup */}
                        <ToggleGroup
                            type="single"
                            value={mode}
                            onValueChange={(val) => {
                                if (!val) return;
                                setMode(val);
                                if (val === "predefined" && !options.includes(selected?.topic)) {
                                    onUserSelect("topic", { topic: "", isCustomTopic: false });
                                }
                            }}
                            className="flex gap-0 mt-2 mb-4"
                        >
                            <ToggleGroupItem
                                value="exported"
                                className="px-6 py-6 border text-sm sm:text-sm md:text-base lg:text-lg font-bold flex items-center gap-2
                                    rounded-l-sm rounded-r-none
                                    data-[state=on]:bg-primary-50
                                    data-[state=on]:border-primary
                                    data-[state=on]:text-primary"
                            >
                                🎬 Exported Videos
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="preview"
                                className="px-6 py-6 border text-sm sm:text-sm md:text-base lg:text-lg font-bold flex items-center gap-2
                                rounded-r-sm rounded-l-none
                                data-[state=on]:bg-primary-50
                                data-[state=on]:border-primary
                                data-[state=on]:text-primary"
                            >
                                📝 Draft Videos
                            </ToggleGroupItem>
                        </ToggleGroup>

                        {/* Video List */}
                        {mode === "exported" && (
                            <div className="mt-4">
                                <ListVideosExported videos={listVideos?.listVideoExported || []} />
                            </div>
                        )}
                        {mode === "preview" && (
                            <div className="mt-4">
                                <ListVideosDraft videos={listVideos?.listVideoPreview || []} />
                            </div>
                        )}
                    </>)
            )}





        </div >
    );
}

export default Dashboard;