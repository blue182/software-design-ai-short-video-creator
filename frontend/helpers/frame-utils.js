const defaultFrame = {
    segment_index: 1,
    start_time: 0,
    end_time: 5,
    duration: 5,
    image_url: 'https://res.cloudinary.com/dszu0fyxg/image/upload/v1734359758/z9ibm1ui8b167tktghsj.jpg',
    audio_url: 'https://res.cloudinary.com/dszu0fyxg/video/upload/v1751693967/ai-short-video-creator/vid_7e44a5_1751692997/preview/lig1iym8x5v9i3u1itj6.mp4',
    text: "Hello, this is a default frame",
    description_image: '',
    subtitle_color: 'yellow',
    subtitle_bg: 'rgba(0, 0, 0, 0.5)',
    text_styles: [],
    subtitle_enabled: false,
    stroke_color: 'black',
    stroke_width: 3,
    font_size: 20,
    animation: 'zoom-out',
    space_bottom: 0,

}

export function convertToFrameList(rawData) {
    const defaultFrameSettings = {
        image_url: '/footage.png',
        subtitle_color: 'yellow',
        subtitle_bg: 'rgba(0, 0, 0, 0.5)',
        text_styles: [],
        subtitle_enabled: false,
        stroke_color: 'black',
        stroke_width: 3,
        font_size: 20,
        animation: 'fade',
        space_bottom: 0,
        description_image: '',

    };

    return rawData.map(segment => {

        const data = {
            segment_index: segment.segment_index,
            start_time: segment.start_time,
            end_time: segment.end_time,
            duration: segment.duration,
            image_url: segment.image_url || defaultFrameSettings.image_url,
            audio_url: segment.audio_url || null,
            text: segment.text || defaultFrameSettings.text,
            preview_url: segment.preview_url || segment.image_url || defaultFrameSettings.image_url,
            subtitle_color: segment.subtitle_color || defaultFrameSettings.subtitle_color,
            subtitle_bg: segment.subtitle_bg || defaultFrameSettings.subtitle_bg,
            text_styles: Array.isArray(segment.text_styles)
                ? segment.text_styles
                : defaultFrameSettings.text_styles,

            subtitle_enabled: segment.subtitle_enabled !== undefined ? segment.subtitle_enabled : defaultFrameSettings.subtitle_enabled,
            stroke_color: segment.stroke_color || defaultFrameSettings.stroke_color,
            stroke_width: segment.stroke_width || defaultFrameSettings.stroke_width,
            font_size: segment.font_size || defaultFrameSettings.font_size,
            animation: segment.animation || defaultFrameSettings.animation,
            space_bottom: segment.space_bottom || defaultFrameSettings.space_bottom,
            description_image: segment.description_image || defaultFrameSettings.description_image,
        };

        return {
            ...data,
        }
    });
}