"use client";
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '../../../components/ui/button'
import SelectLanguage from './_components/SelectLanguage';
import SelectVoice from './_components/SelectVoice';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';

function CreateNew() {
    const [formData, setFormData] = useState({
        topic: {},
        style: {},
        duration: {},
        language: {},
        voice: {}
    });
    const [script, setScript] = useState('');
    const [errorField, setErrorField] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);


    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
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
            alert(`Please choose: ${missing.join(', ')}`);
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        console.log('Form Data:', formData);

        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await axios.post('/api/generate-raw-script', formData);
            const result = res.data;
            console.log('Script from AI:', result.script);
            setScript(result.script);
            setTitle(result.title || 'Generated Script');
        } catch (err) {
            console.error('Error when send form:', err);
        }
        setLoading(false);
    };

    return (
        <div className='md:px-20 py-10 px-16'>
            <h1 className='font-bold text-primary text-center sm:text-2xl md:text-3xl lg:text-3xl'>Create New</h1>

            <div className='mt-10 shadow p-10 border border-blue-400 rounded-lg bg-white'>

                {script ? (
                    <div className="mt-2">
                        <h2 className="font-bold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl">Generated Raw Script from AI</h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-500">Title: {title}</p>
                        <textarea
                            className="w-full h-60 p-4 border rounded resize-none mt-2 border p-5 border-blue-700"
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                        />
                    </div>
                ) : (
                    <>
                        {/* Select Topic */}
                        < SelectTopic onUserSelect={onHandleInputChange} selected={formData.topic} hasError={errorField.includes('topic')} />
                        {/* Select Style */}
                        <SelectStyle onUserSelect={onHandleInputChange} selected={formData.style} hasError={errorField.includes('style')} />
                        {/* Duration */}
                        <SelectDuration onUserSelect={onHandleInputChange} selected={formData.duration} hasError={errorField.includes('duration')} />
                        {/* Select Language */}
                        <SelectLanguage onUserSelect={onHandleInputChange} selected={formData.language} hasError={errorField.includes('language')} />
                        {/* Select Voice */}
                        <SelectVoice onUserSelect={onHandleInputChange} selected={formData.voice} hasError={errorField.includes('voice')} />
                    </>
                )

                }

                {/* Create Button */}
                <div className="flex items-center justify-center mt-10">
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
                                onClick={() => {
                                    console.log('Generating video with script:', script);
                                }}
                            >
                                Generate Video
                            </Button>
                        </>
                    )}
                </div>



            </div>

            <CustomLoading loading={loading} />
        </div>
    )
}

export default CreateNew