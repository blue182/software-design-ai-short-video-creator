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


function SelectLanguage({ onUserSelect, selected, hasError }) {
    const [optionLanguages, setOptionLanguages] = useState([]);

    useEffect(() => {
        axios.get('/languages')
            .then((response) => {
                // Assuming the response contains an array of languages
                const languages = response.data;
                setOptionLanguages(languages);
            })
            .catch((error) => {
                console.error('Error fetching languages:', error);
            });


    }, []);

    return (
        <div className='mt-10'>
            <h2 className="font-bold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl">
                Language
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-500">
                Select the language for your video
            </p>
            <Select
                value={selected?.code || ''}
                onValueChange={(value) => {
                    onUserSelect('language', { code: value, id: optionLanguages.find(lang => lang.code === value)?.id, languages: optionLanguages.find(lang => lang.code === value)?.name })
                }} >
                <SelectTrigger
                    className={`w-full mt-2 p-6 text-sm sm:text-base md:text-lg lg:text-xl border ${hasError ? 'border-red-500' : 'border-gray-300'}`}

                >
                    <SelectValue placeholder="Select language" className="[&[data-placeholder]]:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                    {optionLanguages.map((option) => (
                        <SelectItem key={option.id} value={option.code}>
                            <div className="flex items-center gap-2">
                                <img
                                    src={`/flags/${option.flagEmoji}.svg`}
                                    alt={`${option.name} flag`}
                                    className="w-6 h-5 object-cover border "
                                />
                                <span className="text-sm sm:text-base md:text-base lg:text-lg">
                                    {option.name}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasError && (
                <p className="text-red-500 text-sm mt-2">Please select a language.</p>
            )}

        </div>
    )
}

export default SelectLanguage;