"use client";
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '../../../components/ui/button'
import SelectLanguage from './_components/SelectLanguage';
import SelectVoice from './_components/SelectVoice';

function CreateNew() {
    const [formData, setFormData] = useState([]);
    const onHandleInputChange = (fieldName, fieldValue) => {
        console.log(`Field: ${fieldName}, Value: ${fieldValue}`);

        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }
    return (
        <div className='md:px-20 py-10 px-16'>
            <h1 className='font-bold text-primary text-center sm:text-2xl md:text-3xl lg:text-3xl'>Create New</h1>

            <div className='mt-10 shadow-md p-10'>

                {/* Select Topic */}
                <SelectTopic onUserSelect={onHandleInputChange} />
                {/* Select Style */}
                <SelectStyle onUserSelect={onHandleInputChange} />
                {/* Duration */}
                <SelectDuration onUserSelect={onHandleInputChange} />
                {/* Select Language */}
                <SelectLanguage onUserSelect={onHandleInputChange} />
                {/* Select Voice */}
                <SelectVoice onUserSelect={onHandleInputChange} />


                {/* Create Button */}
                <div className='flex items-center justify-center mt-5 '><Button className="mt-10 text-sm sm:text-base md:text-base lg:text-lg py-5 px-5">Create Short Video</Button></div>


            </div>
        </div>
    )
}

export default CreateNew