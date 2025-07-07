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

const languageToFlagMap = {
    "en-US": "us",
    "en-GB": "gb",
    "vi-VN": "vn",
    "ja-JP": "jp",
    "ko-KR": "kr",
    "zh-CN": "cn",
    "es-ES": "es",
    "fr-FR": "fr",
    "de-DE": "de",
    "th-TH": "th"
};
function getCountryFlagCode(languageCode) {
    console.log('getCountryFlagCode:', languageCode);
    return languageToFlagMap[languageCode] || "us";
}


function SelectVoice({ onUserSelect, selected, hasError }) {
    const [optionVoices, setOptionVoices] = useState([]);
    console.log('SelectVoice:', selected);
    console.log('data:', optionVoices);

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
        <div>
            <h2 className="font-bold text-primary text-lg sm:text-md md:text-lg lg:text-xl">Voice</h2>
            <p className="text-sm sm:text-base md:text-md text-gray-500 mb-2">Select the voice for your video</p>
            <Select
                value={selected?.voice || ''}
                onValueChange={(value) => {
                    onUserSelect('voice', { voice: value, id: optionVoices.find(voice => voice.name === value)?.id, code: optionVoices.find(voice => voice.name === value)?.code })
                }} >
                <SelectTrigger
                    className={`w-full mt-2 p-6 text-sm sm:text-base md:text-md lg:text-lg border ${hasError ? 'border-red-500' : 'border-gray-300'}`}

                >
                    <SelectValue placeholder="Select voice" className="[&[data-placeholder]]:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                    {optionVoices.map((option) => (
                        <SelectItem key={option.id} value={option.name} >
                            <div className="flex items-center justify-between w-full">
                                <img
                                    src={`/flags/${getCountryFlagCode(option.languageCode)}.svg`}
                                    alt={`${option.name} flag`}
                                    className="w-6 h-5 object-cover border"
                                />

                                <span className="text-sm sm:text-base md:text-base lg:text-lg ms-2">
                                    {option.name}
                                </span>

                                <span className="text-xs text-gray-500 ml-2 flex items-center gap-1">
                                    {option.gender === 'Male' ? (
                                        <>

                                            <img
                                                src={`/male.png`}
                                                alt='male'
                                                className="h-4 w-auto object-contain"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                src={`/female.png`}
                                                alt='female'
                                                className="h-4 w-auto object-contain"
                                            />
                                        </>
                                    )}
                                </span>
                            </div>
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