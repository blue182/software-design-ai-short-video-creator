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

function SelectTopic({ onUserSelect }) {
    const options = [
        'Custom Prompt', 'Random AI Story', 'Scary Story', 'Funny Story',
        'Motivational Story', 'Romantic Story', 'Horror Story',
        'Adventure Story', 'Mystery Story', 'Science Fiction Story',
        'Fantasy Story', 'Historical Story', 'Thriller Story', 'Drama Story',
        'Comedy Story', 'Action Story', 'Animated Story', 'Documentary Story'
    ]

    const [selectedOption, setSelectedOption] = useState('');

    return (
        <div>
            <h2 className="font-bold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl">Content</h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-500">What is the topic of your video?</p>

            <Select onValueChange={(value) => {
                setSelectedOption(value)
                value !== 'Custom Prompt' && onUserSelect('topic', value)
            }} >
                <SelectTrigger className="w-full mt-2 p-6 text-sm sm:text-base md:text-lg lg:text-xl">
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

            {selectedOption === 'Custom Prompt' && (
                <div><Textarea className="mt-5" placeholder="Write prompt on which you want to generate video"
                    onChange={(e) => onUserSelect('topic', e.target.value)} /></div>
            )}

        </div>
    )
}

export default SelectTopic