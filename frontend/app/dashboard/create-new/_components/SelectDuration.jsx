"use client"
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


function SelectDuration({ onUserSelect }) {
    return (
        <div className='mt-10'>
            <h2 className='font-bold text-xl'>Duration</h2>

            <p className='text-gray-500'>Select the duration of your video</p>

            <Select onValueChange={(value) => {
                value !== 'Custom Prompt' && onUserSelect('duration', value)
            }} >
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="15 seconds">15 seconds</SelectItem>
                    <SelectItem value="30 seconds">30 seconds</SelectItem>
                    <SelectItem value="1 minute">1 minute</SelectItem>
                </SelectContent>
            </Select>

        </div>
    )
}

export default SelectDuration