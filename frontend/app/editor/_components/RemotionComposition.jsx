//  RemotionComposition.jsx
import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    Audio,
} from 'remotion';
import AnimatedFrame from './AnimatedFrame';

const FPS = 30;

function RemotionComposition({ frameList }) {
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

                return (
                    <Sequence key={frame.id || index} from={fromFrame} durationInFrames={duration}>
                        {isActive && (
                            <AnimatedFrame
                                frame={frame}
                                duration={duration}
                                frameIndex={localFrame}
                            />
                        )}
                        {frame.audio_url && (
                            <Audio
                                src={frame.audio_url}
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

