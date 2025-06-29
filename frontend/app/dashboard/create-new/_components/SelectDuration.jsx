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


function SelectDuration({ onUserSelect, selected, hasError }) {
    const [optionDurations, setOptionDurations] = useState([]);

    useEffect(() => {
        axios.get('/durations')
            .then((response) => {
                // Assuming the response contains an array of durations
                const durations = response.data;
                setOptionDurations(durations);
            })
            .catch((error) => {
                console.error('Error fetching durations:', error);
            });
    }, []);

    if (!optionDurations || optionDurations.length === 0) {
        setOptionDurations([
            { id: 1, seconds: 15, label: '15s' },
            { id: 2, seconds: 30, label: '30s' },
            { id: 3, seconds: 45, label: '45s' },
            { id: 4, seconds: 60, label: '60s' },
        ]);
    }

    return (
        <div className='mt-10'>
            <h2 className="font-bold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl">Duration</h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-500">Select the duration of your video</p>

            <Select value={selected?.value || ''} onValueChange={(value) => {
                onUserSelect('duration', { value: value, id: optionDurations.find(option => option.seconds === parseInt(value)).id })
            }} >
                <SelectTrigger
                    className={`w-full mt-2 p-6 text-sm sm:text-base md:text-lg lg:text-xl border ${hasError ? 'border-red-500' : 'border-gray-300'}`}

                >
                    <SelectValue placeholder="Select duration" className="[&[data-placeholder]]:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                    {optionDurations.map((option) => (
                        <SelectItem key={option.id} value={option.seconds}>
                            <span className="text-sm sm:text-base md:text-base lg:text-lg">
                                {option.label}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasError && (
                <p className="text-red-500 text-sm mt-2">Please select a duration.</p>
            )}

        </div>
    )
}

export default SelectDuration