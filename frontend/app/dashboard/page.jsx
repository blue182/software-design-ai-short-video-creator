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
import VideoStatistics from "./_components/VideoStatistics";
import LoadingData from "@/components/LoadingData";
import LoadingDataVideo from "@/components/LoadingDataVideo";
import { Button } from "@/components/ui/button";

function Dashboard() {
    const { listVideos, setListVideos } = useContext(ListVideosContext);
    const { userDetail } = useContext(UserDetailContext);
    const [mode, setMode] = useState("exported");
    const [loading, setLoading] = useState(true);
    const { videoFrames, setVideoFrames } = useContext(VideoFrameContext);
    const [loadingVideoDraft, setLoadingVideoDraft] = useState(false);

    const [userReady, setUserReady] = useState(false);

    useEffect(() => {
        if (userDetail && userDetail.id) {
            setUserReady(true);
        }
    }, [userDetail]);

    useEffect(() => {
        if (!userReady) return;

        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/videos/get-list-videos", {
                    params: { userId: userDetail.id },
                });

                const data = response.data;

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
    }, [userReady, setListVideos]);

    const hasNoVideos =
        listVideos?.listVideoExported?.length === 0 &&
        listVideos?.listVideoPreview?.length === 0;

    return (
        <div className="md:px-10 mt-5 py-3">
            <div className="flex sm:items-center justify-between gap-4 mb-6 border-b border-primary-300 pb-4">

                <h2 className="font-bold text-xl sm:text-xl md:text-2xl lg:text-3xl text-primary">Dashboard</h2>
                <Link href="/dashboard/create-new">
                    <Button>
                        Create New Video
                    </Button>
                </Link>
            </div>
            {loading ? (

                <LoadingData loading={loading} />
            ) : (hasNoVideos ? (
                <EmptyState />
            ) : (
                <>
                    {/* Dashboard Stats */}
                    <VideoStatistics loading={loading} />

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
                            <ListVideosExported />
                        </div>
                    )}
                    {mode === "preview" && (
                        <div className="mt-4">
                            <ListVideosDraft loadingVideoDraft={loadingVideoDraft} setLoadingVideoDraft={setLoadingVideoDraft} />
                        </div>
                    )}
                </>
            ))
            }

            {loadingVideoDraft && (
                <LoadingDataVideo loading={loadingVideoDraft} />
            )}

        </div >
    );
}

export default Dashboard;