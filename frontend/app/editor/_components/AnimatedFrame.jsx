
import React from 'react';
import { Img, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export default function AnimatedFrame({ frame, duration, frameIndex }) {

    const { width, height } = useVideoConfig();

    // ===== animation logic =====

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let opacity = 1;

    // Tính animation xuyên suốt duration
    const progress = interpolate(frameIndex, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    switch (frame.animation) {
        case 'fade':
            opacity = progress;
            break;
        case 'zoom-in':
            scale = interpolate(progress, [0, 1], [1, 1.2]);
            break;
        case 'zoom-out':
            scale = interpolate(progress, [0, 1], [1.2, 1]);
            break;
        case 'slide-left':
            translateX = interpolate(progress, [0, 1], [width, 0]);
            break;
        case 'slide-right':
            translateX = interpolate(progress, [0, 1], [-width, 0]);
            break;
        case 'slide-up':
            translateY = interpolate(progress, [0, 1], [height, 0]);
            break;
        case 'slide-down':
            translateY = interpolate(progress, [0, 1], [-height, 0]);
            break;
        default:
            // no animation
            break;
    }

    const transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;

    // ====== render component =====

    return (
        <>
            <Img
                src={frame.image_url || '/fallback.jpg'}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    transform,
                    opacity,
                    transition: 'all 0.1s linear',
                }}
            />
            {frame.subtitle_enabled && (
                <div
                    // style={{
                    //     position: 'absolute',
                    //     bottom: frame.space_bottom || 20,


                    //     display: 'inline-block',
                    //     borderRadius: '8px',
                    //     textAlign: 'center',
                    //     fontSize: frame.font_size || 20,
                    //     color: frame.subtitle_color || 'white',
                    //     backgroundColor: frame.subtitle_bg || 'rgba(0,0,0,0.5)',
                    //     fontWeight: frame.text_styles?.includes('bold') ? '700' : '400',
                    //     fontStyle: frame.text_styles?.includes('italic') ? 'italic' : 'normal',
                    //     textDecoration: [
                    //         frame.text_styles?.includes('underline') ? 'underline' : '',
                    //         frame.text_styles?.includes('strikethrough') ? 'line-through' : '',
                    //     ].filter(Boolean).join(' '),
                    //     textShadow: `${frame.stroke_width || 2}px ${frame.stroke_width || 2}px ${frame.stroke_color || 'black'}`,
                    //     padding: '10px 20px',
                    // }}

                    style={{
                        position: 'absolute',
                        bottom: frame.space_bottom || 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        maxWidth: '90%',          // Chiều ngang tối đa
                        width: 'max-content',     // Tự động co lại với text ngắn
                        textAlign: 'center',
                        backgroundColor: frame.subtitle_bg || 'rgba(0,0,0,0.5)',
                        color: frame.subtitle_color || 'white',
                        fontSize: frame.font_size || 20,
                        fontWeight: frame.text_styles?.includes('bold') ? '700' : '400',
                        fontStyle: frame.text_styles?.includes('italic') ? 'italic' : 'normal',
                        textDecoration: [
                            frame.text_styles?.includes('underline') ? 'underline' : '',
                            frame.text_styles?.includes('strikethrough') ? 'line-through' : '',
                        ].filter(Boolean).join(' '),
                        textShadow: `${frame.stroke_width || 2}px ${frame.stroke_width || 2}px ${frame.stroke_color || 'black'}`,
                        padding: '10px 20px',
                        borderRadius: '8px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                    }}

                >
                    {frame.text}
                </div>
            )}
        </>
    );
}



