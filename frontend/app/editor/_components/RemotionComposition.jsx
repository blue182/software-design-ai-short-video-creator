//  RemotionComposition.jsx
import React, { useMemo } from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    Audio,
} from 'remotion';
import AnimatedFrame from './AnimatedFrame';

const FPS = 30;

function RemotionComposition({ frameList, listImageUserUpload, listAudioUserUpload }) {
    const currentFrame = useCurrentFrame(); // 
    const { width, height } = useVideoConfig();

    let trackFrame = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {frameList.map((frame, index) => {
                const duration = Math.round(frame.duration * FPS);
                const fromFrame = trackFrame;
                const toFrame = fromFrame + duration;
                const isActive = currentFrame >= fromFrame && currentFrame < toFrame;
                const localFrame = currentFrame - fromFrame;

                trackFrame = toFrame;

                const imageObj = listImageUserUpload?.[frame?.segment_index ?? index];
                const image_url = imageObj?.url || frame?.image_url;

                const audio_url = listAudioUserUpload?.[frame?.segment_index ?? index] || frame?.audio_url;
                return (
                    <Sequence key={frame.id || index} from={fromFrame} durationInFrames={duration}>
                        {isActive && (
                            <AnimatedFrame
                                frame={{ ...frame, image_url }}
                                duration={duration}
                                frameIndex={localFrame}
                            />
                        )}
                        {audio_url && (
                            <Audio
                                src={audio_url}
                                startFrom={0}
                                endAt={duration}
                                volume={1}
                            />
                        )}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
}

export default RemotionComposition;

