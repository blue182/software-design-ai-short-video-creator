"use client"
import React from 'react'
import Header from '../dashboard/_components/Header'
import { Button } from '@/components/ui/button'
import TrackList from './_components/TrackList'
import RemotionPlayer from './_components/RemotionPlayer'
import { VideoFrameContext } from '../_contexts/VideoFrameContext'
import FrameConfig from './_components/FrameConfig'
import axios from 'axios'
import VideoExportDialog from './_components/VideoExportDialog'
import CustomLoading from '@/components/CustomLoading'
import { UserDetailContext } from '../_contexts/UserDetailContext'
import { convertToFrameList } from '@/helpers/frame-utils'



function Editor() {
    const { videoFrames, setVideoFrames } = React.useContext(VideoFrameContext);
    const [loading, setLoading] = React.useState(false);
    const [videoUrl, setVideoUrl] = React.useState(null);
    const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
    const [idCloud, setIdCloud] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [infoData, setInfoData] = React.useState({});
    const [frameList, setFrameList] = React.useState([])
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        const savedData = localStorage.getItem('video_data');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setVideoFrames(parsedData);
            } catch (error) {
                console.error('Error parsing video_data from localStorage:', error);
            }
        }
        setMounted(true);
    }, []);

    if (!mounted) return null;



    const handleExport = async () => {
        console.log('click export');
        setLoading(true);
        try {
            const res = await axios.post('/api/export-video', {
                id_cloud: videoFrames?.id_cloud || 'temporary-id',
                segments: videoFrames?.framesList || [],
            });

            const { videoUrl } = res.data;



            if (videoUrl) {

                try {
                    const response = await axios.post('/api/videos/save-video-export', {
                        videoId: videoFrames?.videoId || 'temporary-id',
                        videoUrl: videoUrl,
                    });

                    if (response.data.ok) {
                        console.log('Video export URL saved successfully:', response.data.videoUrl);
                    } else {
                        console.error('Failed to save video export URL:', response.data.error);
                    }
                } catch (error) {
                    console.error('Error saving video export URL:', error);
                    alert('Failed to save video export URL. Check console for details.');
                }

                setVideoFrames({
                    ...videoFrames,
                    videoUrl: videoUrl,
                });
                setVideoUrl(videoUrl);


            } else {
                alert('Render complete but no video URL was returned.');
            }
        } catch (err) {
            console.error('Export failed:', err);
            alert('Export failed. Check console for details.');
        }
        setLoading(false);
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

            {videoUrl && (
                <VideoExportDialog videoUrl={videoUrl} title={videoFrames.title} />
            )}

            {loading && (
                <CustomLoading loading={loading} />
            )}


        </div>
    )
}

export default Editor