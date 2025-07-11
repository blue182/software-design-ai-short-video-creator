'use client';

import React from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import formatDateTime from "@/helpers/format-date";


export default function VideoExportDetail({ selectedVideo, setSelectedVideo }) {
    const [showDialog, setShowDialog] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        if (selectedVideo && selectedVideo?.export_video_url) {
            setShowDialog(true);
        }
    }, [selectedVideo]);

    const [isUploading, setIsUploading] = React.useState(false);

    const handleShare = async () => {
        console.log("Sharing video to YouTube...");
        setIsUploading(true);
        try {
        const res = await fetch('/api/upload-yt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: selectedVideo.title || 'AI Generated Video',
                description: selectedVideo.description || 'From Aizento',
                videoUrl: selectedVideo.export_video_url,
                videoId: selectedVideo.id,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            console.log("✅ YouTube link:", data.youtubeUrl);
            alert(`Video uploaded to YouTube: ${data.youtubeUrl}`);
            navigator.clipboard.writeText(data.youtubeUrl);
            
            } else {
                console.error("❌ Upload failed:", data.error);
                alert(`Upload failed: ${data.error}`);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (videoUrl) => {
        try {
            const response = await fetch(videoUrl, {
                mode: "cors",
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;


            const fileName = videoUrl.split("/").pop() || "video.mp4";
            a.download = fileName;

            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error download video: ", error);
            alert("Download failed. Please try again.");
        }
    };


    const handleClose = () => {
        setSelectedVideo(null);
        setShowDialog(false);
    };

    return (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog} className="p-10 m-10">
            <AlertDialogContent className="max-w-4xl px-6 py-4 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[98vh] scrollbar-hide">

                <AlertDialogHeader className="p-2 pb-0">
                    <AlertDialogTitle>                {selectedVideo?.title && (
                        <div className="mt-3 text-center">
                            <h3 className="text-xl font-semibold text-primary">Video Title: {selectedVideo?.title}</h3>
                        </div>
                    )}</AlertDialogTitle>

                    <VisuallyHidden>
                        <AlertDialogTitle>Loading dialog</AlertDialogTitle>
                    </VisuallyHidden>
                    <VisuallyHidden>
                        <AlertDialogDescription>
                            The script is being generated. Please wait.
                        </AlertDialogDescription>
                    </VisuallyHidden>
                </AlertDialogHeader>

                {/* Video player */}
                <div className="aspect-video w-full p-2 pt-2">
                    <video
                        src={selectedVideo?.export_video_url}
                        controls
                        className="w-full h-full rounded-xl"
                    />
                </div>

                {/* Video Info Section */}
                <div className="border-t border-gray-200 mt-4 pt-4 p-2">
                    <h2 className='text-base md:text-lg lg:text-xl font-bol text-primary-500 mb-3 '>Information video</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-base sm:text-sm text-gray-700 ">
                        <div className="space-y-2">
                            <p><span className="font-semibold">📝 Title:</span> {selectedVideo?.title}</p>
                            <p><span className="font-semibold">📚 Topic:</span> {selectedVideo?.topic}</p>
                            <p><span className="font-semibold">🎨 Style:</span> {selectedVideo?.style?.name}</p>
                            <p><span className="font-semibold">🌐 Language:</span> {selectedVideo?.language?.name} </p>
                            <p><span className="font-semibold">🎤 Voice:</span> {selectedVideo?.voice?.name} </p>

                        </div>
                        <div className="space-y-2">
                            <p><span className="font-semibold">🕒 Duration:</span> {selectedVideo?.duration?.label} </p>


                            {(() => {
                                const size = JSON.parse(selectedVideo?.video_size || '{}');
                                return (
                                    <p>
                                        <span className="font-semibold">📏 Size:</span>{" "}
                                        {size.aspect || 'N/A'} ({size.width}x{size.height})
                                    </p>
                                );
                            })()}
                            <p><span className="font-semibold">📅 Created at:</span> {formatDateTime(selectedVideo?.created_at)}</p>
                            <p><span className="font-semibold">📅 Export at:</span> {formatDateTime(selectedVideo?.updated_at)}</p>
                            <p><span className="font-semibold">📌 Status:</span> {selectedVideo?.status}</p>
                        </div>
                    </div>

                </div>
                <div className="flex gap-4 flex-wrap items-center mt-2 px-2">
                    <Button onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                    </Button>

                    {/* Download */}
                    <Button variant="secondary" onClick={() => handleDownload(selectedVideo?.export_video_url)}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                    </Button>

                    <Button variant="outline" className="border-gray-300 ml-auto" onClick={handleClose}>
                        <X className="w-4 h-4 mr-0" />
                        Close
                    </Button>
                </div>

            </AlertDialogContent>
        </AlertDialog>
    );
}
