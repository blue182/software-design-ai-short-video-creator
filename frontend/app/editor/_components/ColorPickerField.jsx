import React from 'react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ColorPicker from 'react-best-gradient-color-picker'

function ColorPickerField({ label, defaultValue, handleInputChange }) {
    return (
        <div className='flex items-center justify-between gap-7 mt-5'>
            <label className='text-sm'>{label}</label>
            <Popover>
                <PopoverTrigger asChild>
                    <div style={{ backgroundColor: defaultValue }} className='w-10 h-10 rounded-lg border '></div>
                </PopoverTrigger>
                <PopoverContent>
                    <ColorPicker
                        value={defaultValue} onChange={(v) => handleInputChange(v)}
                        width={250}
                        height={200}
                        hideColorGuide
                        hideControls
                        hideEyeDrop

                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ColorPickerField