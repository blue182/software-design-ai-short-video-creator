import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function DropDown({ label, defaultValue, options, handleInputChange }) {
    return (
        <div>

            <label className='text-sm mb-2'>{label}</label>

            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={defaultValue} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, index) => (
                        <SelectItem key={index} value={option.value} onClick={() => handleInputChange(option.value)}>
                            {option.label}
                        </SelectItem>
                    ))}

                </SelectContent>
            </Select>
        </div>
    )
}

export default DropDown