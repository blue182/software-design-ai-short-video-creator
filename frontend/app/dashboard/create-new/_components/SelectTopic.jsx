"use client"
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

function SelectTopic({ onUserSelect, selected, hasError }) {
    const options = [
        'Custom Prompt', 'Random AI Story', 'Scary Story', 'Funny Story',
        'Motivational Story', 'Romantic Story', 'Horror Story',
        'Adventure Story', 'Mystery Story', 'Science Fiction Story',
        'Fantasy Story', 'Historical Story', 'Thriller Story', 'Drama Story',
        'Comedy Story', 'Action Story', 'Animated Story', 'Documentary Story'
    ]

    const [selectedOption, setSelectedOption] = useState('');
    const isCustom = selected?.isCustomTopic === true;
    const [customValue, setCustomValue] = useState(isCustom ? selected?.value : "");

    return (
        <div>
            <h2 className="font-bold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl">Content</h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-500">What is the topic of your video?</p>

            <Select

                value={!isCustom ? selected?.topic : 'Custom Prompt'}
                onValueChange={(value) => {
                    setSelectedOption(value);

                    value !== 'Custom Prompt' ? onUserSelect('topic', { topic: value, isCustomTopic: false }) : onUserSelect('topic', { topic: customValue, isCustomTopic: true });
                }} >
                <SelectTrigger
                    className={`w-full mt-2 p-6 text-sm sm:text-base md:text-lg lg:text-xl border ${hasError ? 'border-red-500' : 'border-gray-300'}`}

                >
                    <SelectValue placeholder="Select content type" className="[&[data-placeholder]]:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, index) => (
                        <SelectItem key={index} value={option} >
                            <span className="text-sm sm:text-base md:text-base lg:text-lg">
                                {option}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {(selectedOption === 'Custom Prompt' || selected?.isCustomTopic) && (
                <div>

                    <Textarea value={selected?.topic || ''} className="mt-5 text-sm sm:text-base md:text-base lg:text-lg" placeholder="Write prompt on which you want to generate video"
                        onChange={(e) => {
                            const value = e.target.value;
                            setCustomValue(value);
                            onUserSelect('topic', { topic: value, isCustomTopic: true });
                        }} />

                </div>
            )}
            {hasError && (
                <p className="text-red-500 text-sm mt-2">Please select a topic.</p>
            )}

        </div>
    )
}

export default SelectTopic