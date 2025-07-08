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

    React.useEffect(() => {

        if (videoFrames && videoFrames.framesList) {
            setFrameList(videoFrames.framesList);
        }
    }, [videoFrames]);



    // React.useEffect(() => {
    //     const rawData = JSON.parse(localStorage.getItem('video_data'));

    //     const id_cloud = rawData?.id_cloud || '';
    //     const title = rawData?.title || 'Untitled Video';
    //     const frames = convertToFrameList(rawData?.segments || []);

    //     const infoData = {
    //         id_cloud: id_cloud,
    //         title: rawData?.title || '',
    //         topic: rawData?.topic || null,
    //         style: rawData?.style || null,
    //         voice: rawData?.voice || null,
    //         video_url: rawData?.video_url || null,
    //         video_size: rawData?.video_size || { aspect: '9:16', width: 720, height: 1280 },
    //     };

    //     setInfoData(infoData);
    //     setTitle(title);
    //     setIdCloud(id_cloud);

    //     setVideoFrames({
    //         id_cloud: id_cloud,
    //         title: title,
    //         framesList: frames,
    //         totalDuration: frames.reduce((acc, f) => acc + (f?.duration || 0), 0),
    //         infoData: infoData,
    //     });
    // }, []);


    const handleExport = async () => {
        console.log('click export');
        setLoading(true);
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        await sleep(10000);



        setVideoUrl("https://res.cloudinary.com/dszu0fyxg/video/upload/v1751971588/ai-short-video-creator/vid_dce71f_1751867232/video/m8zrp8utgbawcy2pgdto.mp4"); // Reset video URL before export

        setLoading(false);

        // try {
        //     const res = await axios.post('/api/export-video', {
        //         id_cloud: videoFrames?.id_cloud || 'temporary-id',
        //         segments: videoFrames?.framesList || [],
        //     });

        //     const { videoUrl } = res.data;

        //     if (videoUrl) {
        //         setVideoUrl(videoUrl);
        //         setVideoFrames(prev => ({
        //             ...prev,
        //             videoUrl: videoUrl,
        //         }));

        //     } else {
        //         alert('Render complete but no video URL was returned.');
        //     }
        // } catch (err) {
        //     console.error('Export failed:', err);
        //     alert('Export failed. Check console for details.');
        // }
    };

    console.log('videoFrames', videoFrames);

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