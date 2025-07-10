"use client";
import React from 'react'
import { Player } from "@remotion/player";
import { MyComposition } from '@/remotion/Composition';
import RemotionComposition from './RemotionComposition';
import { Fullscreen } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { VideoFrameContext } from '@/app/_contexts/VideoFrameContext';

function RemotionPlayer({ listImageUserUpload, listAudioUserUpload }) {
    const { videoFrames, setVideoFrames } = React.useContext(VideoFrameContext);
    const [screenSize, setScreenSize] = React.useState({
        width: 300,
        height: 500,
    });

    const playerRef = React.useRef(null);
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if (videoFrames?.selectedFrame != null) {
            let skipDuration = 0;
            for (let i = 0; i < videoFrames?.selectedFrame; i++) {
                skipDuration += videoFrames?.framesList[i].duration;
            }

            playerRef?.current?.seekTo(skipDuration * 30);
        }
    }, [videoFrames?.selectedFrame]);

    const [aspectRatio, setAspectRatio] = React.useState(16 / 9); // Default fallback

    React.useEffect(() => {
        const updateParam = (mediaWidth, mediaHeight) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const containerAspect = rect.width / rect.height;

            setVideoFrames(prev => ({
                ...prev,
                param: {
                    nature_w: mediaWidth,
                    nature_h: mediaHeight,
                    aspect_ratio: containerAspect,
                }
            }));
        };
        if (videoFrames?.framesList?.length > 0) {
            const first = videoFrames?.framesList[0];
            const url = first?.preview_url || first?.image_url;

            if (url && /\.(mp4|mov|webm)$/i.test(url)) {
                const video = document.createElement('video');
                video.onloadedmetadata = () => {
                    setAspectRatio(video.videoWidth / video.videoHeight);
                    updateParam(video.videoWidth, video.videoHeight);

                };
                video.src = url;
            } else if (url && /\.(jpg|jpeg|png|webp)$/i.test(url)) {
                const img = new Image();
                img.onload = () => {
                    setAspectRatio(img.width / img.height);
                    updateParam(img.width, img.height);
                };
                img.src = url;
            }
        }
    }, [videoFrames?.framesList]);

    const maxHeight = 500;
    const compositionHeight = maxHeight;
    const compositionWidth = !isNaN(aspectRatio) ? Math.round(aspectRatio * 500) : 500

    return (
        <div className='flex flex-col items-center w-full'>
            {Array.isArray(videoFrames?.framesList) && videoFrames?.framesList.length > 0 ? (
                <div
                    style={{
                        width: '100%',
                        maxHeight: `${maxHeight}px`,
                        aspectRatio: !isNaN(aspectRatio) ? aspectRatio : undefined,
                        position: 'relative',
                    }}
                >
                    {videoFrames?.totalDuration > 0 && (
                        <Player
                            ref={playerRef}
                            component={RemotionComposition}
                            durationInFrames={Math.round(videoFrames.totalDuration * 30)}
                            compositionWidth={compositionWidth}
                            compositionHeight={compositionHeight}
                            fps={30}
                            controls
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 5,
                                objectFit: 'contain',
                            }}
                            inputProps={{
                                frameList: videoFrames.framesList,
                                listImageUserUpload: listImageUserUpload,
                                listAudioUserUpload: listAudioUserUpload,
                            }}
                        />
                    )}
                </div>
            ) : (
                <div className='flex items-center justify-center h-full'>
                    <p className='text-gray-500'>
                        No frames available. Please add frames to see the preview.
                    </p>
                </div>
            )}


        </div>
    )
}

export default RemotionPlayer

