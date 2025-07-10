"use client"

import React, { useEffect, useState, useRef } from 'react'
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import axios from '@/lib/axios';
import LoadingData from '@/components/LoadingData';

function SelectLanguage({ onUserSelect, selected, hasError }) {
    const [optionLanguages, setOptionLanguages] = useState([]);
    const hasInitialized = useRef(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/languages')
            .then((response) => {
                setOptionLanguages(response.data);
            })
            .catch((error) => {
                console.error('Error fetching languages:', error);
            });
        setLoading(false);
    }, []);

    return (
        <div >
            <h2 className="font-bold text-primary text-base sm:text-base md:text-lg lg:text-xl">
                Language
            </h2>
            <p className="text-sm sm:text-sm md:text-base text-gray-500 mb-2">
                Select the language for your video
            </p>

            {loading ? (
                <LoadingData />)

                : (<div className={`flex flex-col gap-4 py-2 ${hasError ? 'border border-red-500 p-2 rounded-lg' : ''}`}>
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        value={selected?.code || ''}
                        onValueChange={(val) => {
                            if (!val) return;
                            const lang = optionLanguages.find(l => l.code === val);
                            if (!lang) return;
                            onUserSelect('language', {
                                code: lang.code,
                                id: lang.id,
                                languages: lang.name,
                            });
                        }}
                        className="flex gap-4 flex-wrap py-1 justify-center"
                    >
                        {optionLanguages.map((lang) => (
                            <ToggleGroupItem
                                key={lang.id}
                                value={lang.code}
                                title={lang.name}
                                className={`
                                px-3 py-3 rounded-md border-2 text-sm font-medium
                                border-gray-300
                                data-[state=on]:bg-primary-50
                                data-[state=on]:border-primary
                                data-[state=on]:text-primary
                                transition-all duration-200
                                flex items-center gap-2
                            `}
                            >
                                <img
                                    src={`/flags/${lang.flagEmoji}.svg`}
                                    alt={`${lang.name} flag`}
                                    className="w-6 h-5 object-cover border"
                                />
                                <span className="hidden lg:inline">{lang.name}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                </div>)}

            {hasError && (
                <p className="text-red-500 text-sm mt-2">Please select a language.</p>
            )}
        </div>
    );
}

export default SelectLanguage;
