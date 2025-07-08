"use client"
import { VideoFrameContext } from '@/app/_contexts/VideoFrameContext'
import { line } from 'drizzle-orm/pg-core'
import { Trash2 } from 'lucide-react'
import { space } from 'postcss/lib/list'
import React from 'react'
import { UserDetailContext } from '../../_contexts/UserDetailContext'



function TrackList() {
    const [frameList, setFrameList] = React.useState([])
    const [selectedFrame, setSelectedFrame] = React.useState(0);
    const { videoFrames, setVideoFrames } = React.useContext(VideoFrameContext);
    const { userDetail, setUserDetail } = React.useContext(UserDetailContext);

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
            totalDuration: totalDuration,
            framesList: frameList,
            selectedFrame: selectedFrame,
        })
    }, [frameList, selectedFrame,]);

    React.useEffect(() => {
        if (videoFrames?.framesList && videoFrames?.framesList.length > 0) {
            setFrameList(videoFrames.framesList);
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