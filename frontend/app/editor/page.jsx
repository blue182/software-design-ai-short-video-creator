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
import formatDateTime from '@/helpers/format-date'
import parseVideoSize from '@/helpers/parseVideoSize'
import { useRouter } from 'next/navigation'
import { segments } from '@/configs/schemas/segments'
import LoadingDataVideo from '@/components/LoadingDataVideo'
import ProcessingVideo from '@/components/ProcessingVideo'
import SideNav from '../dashboard/_components/SideNav'



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
    const router = useRouter();
    const [defaultLoading, setDefaultLoading] = React.useState(true);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
    const [listAudioUserUpload, setListAudioUserUpload] = React.useState([]);
    const [listImageUserUpload, setListImageUserUpload] = React.useState([]);

    React.useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


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
        setDefaultLoading(false);
    }, []);

    if (!mounted) return null;

    console.log("📹 Video Frames:", videoFrames);

    const updateFramesListBeforeProceed = async () => {
        // Kiểm tra nếu không có gì để update thì bỏ qua
        if (!videoFrames?.framesList || (!listImageUserUpload && !listAudioUserUpload)) return;

        const updatedSegments = videoFrames?.framesList.map((segment) => {
            const index = segment.segment_index;

            const updatedImage = listImageUserUpload?.[index]?.url;
            const updatedAudio = listAudioUserUpload?.[index];

            return {
                ...segment,
                ...(updatedImage && { image_url: updatedImage }),
                ...(updatedAudio && {
                    audio_url: typeof updatedAudio === 'string'
                        ? updatedAudio
                        : URL.createObjectURL(updatedAudio),
                }),
            };
        });

        console.log("Updated segments:", updatedSegments);

        setVideoFrames({
            ...videoFrames,
            framesList: updatedSegments,
        });

        return updatedSegments;
    };



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
                        segments: videoFrames?.framesList || [],
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

    const handleSave = async () => {
        console.log('click save');
        setLoading(true);
        const updateSegments = await updateFramesListBeforeProceed();

        try {
            const res = await axios.post('/api/videos/save-video-preview', {
                videoId: videoFrames?.videoId || 'temporary-id',
                segments: updateSegments || [],

            });

            if (res.data.ok) {
                setLoading(false);
                setVideoFrames({});
                router.push('/dashboard');
            } else {
                console.error('Failed to save video:', res.data.error);
                alert('Failed to save video. Check console for details.');
            }
        }
        catch (err) {
            console.error('Save failed:', err);
            alert('Save failed. Check console for details.');
        }

    }

    // console.log("listAudioUserUpload:", listAudioUserUpload);
    // console.log("listImageUserUpload:", listImageUserUpload);

    return (
        <div>
            <div>
                <div>
                    <Header onToggleSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />
                </div>

                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${isMobileSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    onClick={() => setMobileSidebarOpen(false)}
                >
                    <div
                        className={`pt-[80px] absolute left-0 top-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SideNav />
                    </div>
                </div>

                <div className='p-5 mt-2 ps-10 pe-10'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-2xl font-bold mb-4 text-primary'>Editor Video</h2>

                        <div className='flex gap-5'>
                            <Button variant="outline" className='mb-4' onClick={handleSave}> Save </Button>
                            <Button className='mb-4' onClick={handleExport}> Export </Button>
                        </div>


                    </div>
                    <div className='grid grid-cols-6 gap-7 mt-5 mb-5'>
                        <div >
                            <TrackList listAudioUserUpload={listAudioUserUpload}
                                listImageUserUpload={listImageUserUpload} />
                        </div>
                        <div className='col-span-3 w-full'>
                            <RemotionPlayer listAudioUserUpload={listAudioUserUpload}
                                listImageUserUpload={listImageUserUpload} />
                        </div>
                        <div className='col-span-2'>
                            <FrameConfig listAudioUserUpload={listAudioUserUpload} setListAudioUserUpload={setListAudioUserUpload}
                                listImageUserUpload={listImageUserUpload} setListImageUserUpload={setListImageUserUpload} />
                        </div>
                    </div>

                    <div className=' mt-10 border-t pt-4 border-primary-200 p-2'>
                        <h2 className='text-base md:text-lg lg:text-xl font-bol text-primary-500 mb-2'>Information video</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-base sm:text-sm text-gray-700 
                                ">

                            <div className="space-y-2">
                                <p><span className="font-semibold">📝 Title:</span> {videoFrames?.title}</p>
                                <p><span className="font-semibold">📚 Topic:</span>
                                    {
                                        typeof videoFrames?.infoVideo?.topic === "string"
                                            ? videoFrames.infoVideo.topic
                                            : videoFrames?.infoVideo?.topic?.topic || "N/A"
                                    }
                                </p>
                                <p><span className="font-semibold">🎨 Style:</span> {videoFrames?.infoVideo?.style?.name || videoFrames?.infoVideo?.style?.style}</p>
                            </div>

                            <div className="space-y-2">
                                <p><span className="font-semibold">🌐 Language:</span> {videoFrames?.infoVideo?.languages?.name || videoFrames?.infoVideo?.languages?.languages}</p>
                                <p><span className="font-semibold">🎤 Voice:</span> {videoFrames?.infoVideo?.voice?.name || videoFrames?.infoVideo?.voice?.voice}</p>
                                <p><span className="font-semibold">🕒 Duration:</span> {videoFrames?.infoVideo?.duration?.value || videoFrames?.infoVideo?.duration?.seconds}s</p>
                            </div>
                            <div className="space-y-2">
                                {(() => {
                                    const size = parseVideoSize(videoFrames?.infoVideo?.video_size);
                                    return (
                                        <p>
                                            <span className="font-semibold">📏 Size:</span>{" "}
                                            {size?.aspect || 'N/A'} ({size?.width}x{size?.height})
                                        </p>
                                    );
                                })()}
                                <p><span className="font-semibold">📅 Created at:</span> {formatDateTime(videoFrames?.infoVideo?.created_at)}</p>
                                <p><span className="font-semibold">📅 Last updated at:</span> {formatDateTime(videoFrames?.infoVideo?.updated_at)}</p>
                            </div>

                            <div className="space-y-2">
                                <p><span className="font-semibold">📌 Status:</span> {videoFrames?.infoVideo?.status}</p>

                            </div>
                        </div>
                    </div>
                </div>

                {videoUrl && (
                    <VideoExportDialog videoUrl={videoUrl} title={videoFrames.title} />
                )}

                {loading && (
                    <ProcessingVideo loading={loading} />
                )}


            </div>
            <LoadingDataVideo defaultLoading={defaultLoading} />
        </div>
    )
}

export default Editor