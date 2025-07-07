import { Textarea } from '@/components/ui/textarea'
import React from 'react'

function TextAreaBox({ frame, handleInputChange }) {
    return (
        <div className='flex flex-col gap-2'>
            <label className='text-sm'>Content</label>
            <Textarea className='bg-white' value={frame?.text} row={5}

                onChange={(e) => handleInputChange(e.target.value)} />
        </div>
    )
}

export default TextAreaBox