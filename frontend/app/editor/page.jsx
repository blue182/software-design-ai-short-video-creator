"use client"
import React from 'react'
import Header from '../dashboard/_components/Header'
import { Button } from '@/components/ui/button'
import TrackList from './_components/TrackList'
import RemotionPlayer from './_components/RemotionPlayer'
import { VideoFrameContext } from '../_contexts/VideoFrameContext'
import FrameConfig from './_components/FrameConfig'
import axios from 'axios'



function Editor() {
    const { videoFrames, setVideoFrames } = React.useContext(VideoFrameContext);

    const handleExport = async () => {
        try {
            const res = await axios.post('/api/export-video', {
                id_cloud: videoFrames?.id_cloud || 'temporary-id',
                segments: videoFrames?.framesList || [],
            });

            const { videoUrl } = res.data;

            if (videoUrl) {
                window.open(videoUrl, '_blank');
            } else {
                alert('Render complete but no video URL was returned.');
            }
        } catch (err) {
            console.error('Export failed:', err);
            alert('Export failed. Check console for details.');
        }
    };

    return (
        <div>
            <Header />
            <div className='p-5 mt-2 ps-10 pe-10'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-2xl font-bold mb-4 text-primary'>Editor Video</h2>
                    <Button className='mb-4' onClick={handleExport}> Export </Button>

                </div>
                <div className='grid grid-cols-6 gap-7 mt-5'>
                    <div >
                        <TrackList />
                    </div>
                    <div className='col-span-3 w-full'>
                        <RemotionPlayer />
                    </div>
                    <div className='col-span-2'>
                        <FrameConfig />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editor