"use client"

import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from '@/lib/axios';

function SelectVoice({ onUserSelect, selected, hasError }) {
    const [optionVoices, setOptionVoices] = useState([]);

    useEffect(() => {
        axios.get('/voices')
            .then((response) => {
                // Assuming the response contains an array of voices
                const voices = response.data;
                setOptionVoices(voices);
            })
            .catch((error) => {
                console.error('Error fetching voices:', error);
            });
    }, []);

    return (
        <div className='mt-10'>
            <h2 className="font-bold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl">Voice</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-500">Select the voice for your video</p>
            <Select
                value={selected?.voice || ''}
                onValueChange={(value) => {
                    onUserSelect('voice', { voice: value, id: optionVoices.find(voice => voice.name === value)?.id })
                }} >
                <SelectTrigger
                    className={`w-full mt-2 p-6 text-sm sm:text-base md:text-lg lg:text-xl border ${hasError ? 'border-red-500' : 'border-gray-300'}`}

                >
                    <SelectValue placeholder="Select voice" className="[&[data-placeholder]]:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                    {optionVoices.map((option) => (
                        <SelectItem key={option.id} value={option.name}>
                            <span className="text-sm sm:text-base md:text-base lg:text-lg">
                                {option.name}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasError && (
                <p className="text-red-500 text-sm mt-2">Please select a voice.</p>
            )}
        </div>
    )
}
export default SelectVoice;