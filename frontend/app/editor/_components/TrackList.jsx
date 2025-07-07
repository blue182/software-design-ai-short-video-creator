"use client"
import { VideoFrameContext } from '@/app/_contexts/VideoFrameContext'
import { line } from 'drizzle-orm/pg-core'
import { Trash2 } from 'lucide-react'
import { space } from 'postcss/lib/list'
import React from 'react'

const defaultFrame = {
    id: 1,
    segment_index: 1,
    start_time: 0,
    end_time: 5,
    duration: 5,
    image_url: 'https://res.cloudinary.com/dszu0fyxg/image/upload/v1734359758/z9ibm1ui8b167tktghsj.jpg',
    audio_url: 'https://res.cloudinary.com/dszu0fyxg/video/upload/v1751693967/ai-short-video-creator/vid_7e44a5_1751692997/preview/lig1iym8x5v9i3u1itj6.mp4',
    text: "Hello, this is a default frame",
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

    };

    return rawData.map(segment => {

        const data = {
            id: segment.id,
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
        };

        return {
            ...data,
        }
    });
}

function TrackList() {
    const [frameList, setFrameList] = React.useState([])
    const [selectedFrame, setSelectedFrame] = React.useState(0);
    const { videoFrames, setVideoFrames } = React.useContext(VideoFrameContext);
    const [idCloud, setIdCloud] = React.useState('');

    const removeFrame = (index) => {
        const newFrameList = frameList.filter((_, i) => i !== index);
        setFrameList(newFrameList);
        if (selectedFrame === index) {
            setSelectedFrame(newFrameList.length > 0 ? Math.max(0, index - 1) : 0);
        }
    }

    React.useEffect(() => {
        let totalDuration = 0;
        frameList.forEach(frame => {
            totalDuration += frame?.duration;
        });
        setVideoFrames({
            id_cloud: idCloud,
            totalDuration: totalDuration,
            framesList: frameList,
            selectedFrame: selectedFrame,
        })
    }, [frameList, idCloud, selectedFrame]);

    React.useEffect(() => {
        const rawData = JSON.parse(localStorage.getItem('video_data'));
        console.log('Raw Data:', rawData);
        const id_cloud = rawData?.id_cloud || '';
        console.log('ID Cloud:', id_cloud);
        setIdCloud(id_cloud);

        if (rawData) {
            const frames = convertToFrameList(rawData?.segments || []);
            const id_cloud = rawData?.id_cloud || '';
            setVideoFrames({
                id_cloud: id_cloud,
            });
            setFrameList(frames);
        } else {
            const listurl = [
                "https://res.cloudinary.com/dszu0fyxg/image/upload/v1733839076/p7bc4y3bylexzctrdv0x.png",
                "https://res.cloudinary.com/dszu0fyxg/image/upload/v1733962793/u6yom8vwdnl00gk6rjkb.jpg",
                "https://res.cloudinary.com/dszu0fyxg/image/upload/v1733839155/bxrz4eqyu5w40imbok6i.png",
                "https://res.cloudinary.com/dszu0fyxg/image/upload/v1732073342/qbwlzexgeux01wpaq7ec.png"
            ]
            const frameList = Array.from({ length: 4 }, (_, i) => ({
                ...defaultFrame,
                id: i,
                image_url: listurl[i] || defaultFrame.image_url,
                start_time: i * 5,
                end_time: (i + 1) * 5,
                duration: 5,
                segment_index: i + 1,
            }));
            setVideoFrames({
                id_cloud: 'temporary-id',
            });

            setFrameList(frameList);
        }
    }, []);


    return (
        <div className='p-3 bg-primary-50 rounded-lg'>
            <div className='max-h-[70vh] overflow-auto p-1 scrollbar-hide'>
                {frameList.map((frame, index) => (
                    <div key={index}
                        className={`flex flex-col items-center mb-2 border-b border-primary-200 pb-2 mt-3 p-2 rounded-lg ${selectedFrame === index ? 'bg-white' : 'bg-transparent hover:bg-primary-100 cursor-pointer'} `}
                        onClick={() => setSelectedFrame(index)}>
                        <img src={frame?.image_url} alt={`Frame ${index + 1}`} width={40} height={40} className='rounded-lg mb-2 w-full h-[40px] object-contain rounded-lg' />
                        <h2 className='text-xs line-clamp-2 mt-1'>{frame?.text}</h2>
                        {selectedFrame === index && (
                            <Trash2 className='w-4 h-4 text-red-500 mt-1 cursor-pointer hover:text-red-700' onClick={() => removeFrame(index)} />
                        )}

                    </div>))}
            </div>
        </div>
    )
}

export default TrackList