
"use client"

import React, { useEffect, useState, useRef } from 'react'
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import axios from '@/lib/axios';

const defaultDurations = [
    { id: 1, seconds: 15, label: '15s' },
    { id: 2, seconds: 30, label: '30s' },
    { id: 3, seconds: 45, label: '45s' },
    { id: 4, seconds: 60, label: '60s' },
];

function SelectDuration({ onUserSelect, selected, hasError }) {
    const [optionDurations, setOptionDurations] = useState([]);
    const hasInitialized = useRef(false);

    useEffect(() => {
        axios.get('/durations')
            .then((response) => {
                const durations = response.data;
                setOptionDurations(durations);
            })
            .catch((error) => {
                console.error('Error fetching durations:', error);
                // fallback nếu lỗi
                setOptionDurations(defaultDurations);
            });
    }, []);

    // fallback nếu API chưa trả về
    if (!optionDurations || optionDurations.length === 0) {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            setOptionDurations(defaultDurations);
        }
    }

    return (
        <div >
            <h2 className="font-bold text-primary text-lg sm:text-md md:text-lg lg:text-xl">Duration</h2>
            <p className="text-sm sm:text-base md:text-md text-gray-500 mb-2">Select the duration of your video</p>

            <div className={`flex flex-col gap-4 py-2 ${hasError ? 'border border-red-500 p-2 rounded-lg' : ''}`}>
                <ToggleGroup
                    type="single"
                    variant="outline"
                    value={selected?.value?.toString() || ''}
                    onValueChange={(val) => {
                        if (!val) return;
                        const option = optionDurations.find(opt => opt.seconds.toString() === val);
                        if (!option) return;
                        onUserSelect('duration', { value: option.seconds, id: option.id });
                    }}
                    className="flex gap-4 py-1 flex-wrap"
                >
                    {optionDurations.map((option) => (
                        <ToggleGroupItem
                            key={option.id}
                            value={option.seconds.toString()}
                            className={`
                                px-6 py-3 rounded-lg border-2 text-base font-medium
                                border-gray-300
                                data-[state=on]:bg-primary-50
                                data-[state=on]:border-primary
                                data-[state=on]:text-primary
                                transition-all duration-200
                            `}
                        >
                            {option.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>

            {hasError && (
                <p className="text-red-500 text-sm mt-2">Please select a duration.</p>
            )}
        </div>
    );
}

export default SelectDuration;
