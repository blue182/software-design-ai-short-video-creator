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
import { CircleArrowRight, Download, Share2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { VideoFrameContext } from "@/app/_contexts/VideoFrameContext";


export default function VideoExportDialog({ title, videoUrl }) {
    const [showDialog, setShowDialog] = React.useState(false);
    const router = useRouter();
    const { videoFrames } = React.useContext(VideoFrameContext);

    React.useEffect(() => {
        if (videoUrl) {
            setShowDialog(true);
        }
    }, [videoUrl]);

    console.log("VideoExportDialog mounted with videoUrl:", videoFrames);

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
                    title: title || 'AI Generated Video',
                    description: 'Video Created From Aizento',
                    videoUrl: videoUrl,
                    videoId: videoFrames.videoId,
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


    if (!videoUrl) return null;

    const handleClose = () => {
        setShowDialog(false);
        router.push("/dashboard");
    };


    return (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog} className="p-10 m-10">
            <AlertDialogContent className="max-w-4xl px-6 py-4 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[98vh]">

                <AlertDialogHeader className="p-2 pb-0">
                    <AlertDialogTitle className="text-lg mt-2 text-primary-700">🎬 Video successfully exported</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm mt-0 text-muted-foreground">
                        Review the video after rendering. You can share or download.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {title && (
                    <div className="mt-3 text-center">
                        <h3 className="text-xl font-semibold text-primary">Video Title: {title}</h3>
                    </div>
                )}


                {/* Video player */}
                <div className="aspect-video w-full p-4 pt-2">
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full rounded-xl"
                    />
                </div>



                <AlertDialogFooter className="flex items-center justify-end gap-4 pt-2">
                    {/* Share */}
                    <Button onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                    </Button>

                    {/* Download */}
                    <Button variant="secondary" onClick={() => handleDownload(videoUrl)}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                    </Button>


                    {/* Close */}
                    <AlertDialogCancel asChild>
                        <Button variant="outline" className="border-gray-300" onClick={handleClose}>

                            Go to Dashboard
                            <CircleArrowRight className="w-4 h-4 mr-0" />
                        </Button>
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
