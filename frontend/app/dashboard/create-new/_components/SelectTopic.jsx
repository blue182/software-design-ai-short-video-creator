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
            <h2 className='font-bold text-xl'>Content</h2>

            <p className='text-gray-500'>What is the topic of your video?</p>

            <Select onValueChange={(value) => {
                setSelectedOption(value)
                value !== 'Custom Prompt' && onUserSelect('topic', value)
            }} >
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, index) => (
                        <SelectItem key={index} value={option}>
                            {option}
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