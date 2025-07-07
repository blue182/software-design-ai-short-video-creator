import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SelectAnimationField({ label, defaultValue, handleInputChange }) {

    const options = [
        { label: "None", value: "none" },
        { label: "Fade", value: "fade" },
        { label: "Zoom In", value: "zoom-in" },
        { label: "Zoom Out", value: "zoom-out" },
        { label: "Slide Left", value: "slide-left" },
        { label: "Slide Right", value: "slide-right" },
        { label: "Slide Up", value: "slide-up" },
        { label: "Slide Down", value: "slide-down" },
    ];

    return (
        <div className='mt-3 flex flex-col gap-2'>
            <label className='text-sm'>{label}</label>
            <Select value={defaultValue} onValueChange={(val) => handleInputChange(val)}>
                <SelectTrigger className="w-full px-3 py-2 border rounded-md bg-white">
                    <SelectValue placeholder="Select animation..." />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
