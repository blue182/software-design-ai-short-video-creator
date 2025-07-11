"use client";
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '../../../components/ui/button'
import SelectLanguage from './_components/SelectLanguage';
import SelectVoice from './_components/SelectVoice';
import axios from 'axios';
import CustomLoading from '@/components/CustomLoading';
import ErrorAlertDialog from "@/components/ErrorAlertDialog";
import { useRouter } from 'next/navigation';
import SelectVideoSize from './_components/SelectVideoSize';
import { UserDetailContext } from '@/app/_contexts/UserDetailContext';
import { convertToFrameList } from '@/helpers/frame-utils';
import { duration } from 'drizzle-orm/gel-core';
import { VideoFrameContext } from '@/app/_contexts/VideoFrameContext';
import { languages } from '@/configs/schemas/languages';

function CreateNew() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        topic: {},
        style: {},
        duration: {},
        language: {},
        voice: {},
        video_size: {} // Default size if not set
    });
    const [script, setScript] = useState('');
    const [errorField, setErrorField] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { userDetail, setUserDetail } = React.useContext(UserDetailContext);
    const { videoFrames, setVideoFrames } = React.useContext(VideoFrameContext);

    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
        setErrorField(prevErrors =>
            prevErrors.includes(fieldName)
                ? prevErrors.filter(field => field !== fieldName)
                : prevErrors
        );
    }

    const validateForm = () => {
        const missing = [];

        for (const [key, value] of Object.entries(formData)) {
            if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
                missing.push(key);
            }
        }

        setErrorField(missing);

        if (missing.length > 0) {
            setShowModal(true);
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        console.log('Form Data:', formData);
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await axios.post('/api/generate/raw-script', formData);
            const result = res.data;
            setScript(result.script);
            setTitle(result.title || 'Generated Script');
        } catch (err) {
            console.error('Error when send form:', err);
        }
        setLoading(false);
    };



    const saveDraft = async (infoVideo, segments) => {

        if (!userDetail || !userDetail.id) {
            console.error('User detail is not available');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('/api/videos/create-preview', {
                userId: userDetail.id,
                infoVideo: infoVideo,
                segments: segments
            });
            const result = res.data;

            return result;
        } catch (err) {
            console.error('Error saving draft:', err);
            // Handle error, e.g., show error message
        }
    }

    const handleGenerateVideo = async () => {

        const scriptData = {
            script: script,
            title: title,
            topic: formData.topic,
            style: formData.style,
            duration: formData.duration,
            language: formData.language,
            voice: formData.voice,
            video_size: formData.video_size || { aspect: '9:16', width: 720, height: 1280 } // Default size if not set
        }
        setLoading(true);
        try {
            const res = await axios.post('/api/generate/preview-video', scriptData);
            const result = res.data;
            const infoVideo = {
                id_cloud: result?.id_cloud,
                title: result?.title || '',
                languages: result?.language || null,
                topic: result?.topic || null,
                style: result?.style || null,
                voice: result?.voice || null,
                duration: result?.duration || null,
                video_url: result?.video_url || null,
                video_size: result?.video_size || { aspect: '9:16', width: 720, height: 1280 },
                created_at: result?.created_at || new Date().toISOString(),
                updated_at: result?.updated_at || new Date().toISOString(),
                status: result?.status || 'preview',

            };
            const segments = convertToFrameList(result?.segments || []);

            const data = await saveDraft(infoVideo, segments);
            console.log('Draft saved:', data);
            const video_data = {
                id_cloud: result?.id_cloud || '',
                infoVideo: infoVideo,
                framesList: data?.framesList || [],
                totalDuration: infoVideo.duration?.value || 0,
                videoId: data?.videoId || '',
                title: infoVideo.title || 'Untitled Video',
            }
            localStorage.setItem('video_data', JSON.stringify(video_data));

            router.push('/editor')

        } catch (err) {
            console.error('Error when generate video:', err);
        }
        setLoading(false);
    }


    return (
        <>
            <div className='p-10 sm:p-5 flex flex-col justify-center items-center gap-5'>
                <h1 className='font-bold text-base sm:text-xl md:text-xl lg:text-2xl text-primary text-center'>Create New Viral Video With AIzento</h1>

                <div className='mt-10 shadow pt-10 pb-5 p-10 border border-blue-400 rounded-lg bg-white w-full max-w-5xl'>

                    {script ? (
                        <div className="mt-2">
                            <h2 className="font-bold text-primary text-lg sm:text-sm md:text-lg lg:text-xl mb-2">Generated Raw Script from AI</h2>
                            <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-2">Title: {title}</p>
                            <textarea
                                className="w-full bg-white p-4 border rounded resize-y max-h-[600px] min-h-[200px] mt-2 border p-5 border-blue-700"
                                rows={10}
                                placeholder="Generated script will appear here..."
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* Select Topic */}
                            < SelectTopic onUserSelect={onHandleInputChange} selected={formData.topic} hasError={errorField.includes('topic')} />
                            {/* Select Style */}
                            <SelectStyle onUserSelect={onHandleInputChange} selected={formData.style} hasError={errorField.includes('style')} />
                            {/* Duration */}
                            <SelectDuration onUserSelect={onHandleInputChange} selected={formData.duration} hasError={errorField.includes('duration')} />
                            {/* Video Size */}
                            <SelectVideoSize onUserSelect={onHandleInputChange} selected={formData.video_size} />
                            {/* Select Language */}
                            <SelectLanguage onUserSelect={onHandleInputChange} selected={formData.language} hasError={errorField.includes('language')} />
                            {/* Select Voice */}
                            <SelectVoice onUserSelect={onHandleInputChange} selected={formData.voice} hasError={errorField.includes('voice')} />

                        </div>
                    )

                    }

                    {/* Create Button */}
                    <div className="flex items-center justify-center mt-10 mb-5">
                        {!script ? (
                            <Button
                                className="text-sm sm:text-base md:text-base lg:text-lg py-5 px-5"
                                onClick={handleSubmit}
                            >
                                Generate Script
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="mr-4 text-sm sm:text-base md:text-base lg:text-lg py-5 px-5"
                                    onClick={() => {
                                        setErrorField([]);
                                        setScript('');
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    className="text-sm sm:text-base md:text-base lg:text-lg py-5 px-5"
                                    onClick={handleGenerateVideo}
                                >
                                    Generate Video
                                </Button>
                            </>
                        )}
                    </div>

                </div>

                <CustomLoading loading={loading} />
            </div>
            <ErrorAlertDialog
                open={showModal}
                onClose={() => setShowModal(false)}
                missingFields={errorField}
            />

        </>
    )
}

export default CreateNew