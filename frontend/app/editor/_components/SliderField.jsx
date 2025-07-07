import { Slider } from '@/components/ui/slider'
import React from 'react'

function SliderField({ label, defaultValue, handleInputChange, maxValue = 100, step = 1 }) {
    return (
        <div className='mt-3 flex flex-col gap-2'>
            <div className='flex item-center justify-between'>
                <label className='text-sm mb-3'>{label}</label>
                <span className='text-sm font-semibold'>{defaultValue}</span>

            </div>
            <Slider value={[defaultValue]} max={maxValue} min={0} step={step} onValueChange={(value) => handleInputChange(value[0])} />
        </div>
    )
}

export default SliderField