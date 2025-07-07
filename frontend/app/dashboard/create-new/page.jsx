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

function CreateNew() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        topic: {},
        style: {},
        duration: {},
        language: {},
        voice: {},
        video_size: { aspect: '9:16', width: 720, height: 1280 } // Default size if not set
    });
    const [script, setScript] = useState('');
    const [errorField, setErrorField] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const onHandleInputChange = (fieldName, fieldValue) => {
        console.log('onHandleInputChange:', fieldName, fieldValue);
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

    const handleGenerateVideo = async () => {
        // console.log('Form Data:', formData);
        // console.log('Script:', script);
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
        console.log('Script Data:', scriptData);
        setLoading(true);
        try {
            const res = await axios.post('/api/export-video', scriptData);
            const result = res.data;
            // const result = "fake data for testing";
            console.log('Video generation response:', result);
            localStorage.setItem('video_data', JSON.stringify(result));
            router.push('/dashboard/preview')
            // Handle the response as needed, e.g., navigate to video page or show success message
        } catch (err) {
            console.error('Error when generate video:', err);
            // Handle error, e.g., show error message
        }
        setLoading(false);
    }


    return (
        <>
            <div className='py-10 px-16 flex flex-col '>
                <h1 className='font-bold text-primary text-xl sm:text-2xl md:text-3xl lg:text-3xl text-center'>Create New</h1>

                <div className='mt-10 shadow py-5 px-16 border border-blue-400 rounded-lg bg-white w-full max-w-5xl'>

                    {script ? (
                        <div className="mt-2">
                            <h2 className="font-bold text-primary text-lg sm:text-sm md:text-lg lg:text-xl mb-2">Generated Raw Script from AI</h2>
                            <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-2">Title: {title}</p>
                            <textarea
                                className="w-full p-4 border rounded resize-y max-h-[600px] min-h-[200px] mt-2 border p-5 border-blue-700"
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