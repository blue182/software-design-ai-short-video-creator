'use client'
import React from 'react'
import { Bold, Italic } from "lucide-react"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

function ToggleGroupField({ defaultValue = [], handleInputChange }) {
    const [value, setValue] = React.useState(defaultValue)

    const handleChange = (val) => {
        setValue(val)
        handleInputChange(val)
    }
    const baseItemClasses =
        "border rounded p-2 bg-white text-primary transition-colors duration-150"
    const selectedClasses =
        "data-[state=on]:bg-primary data-[state=on]:text-white"

    return (
        <div className="flex items-center justify-between gap-2 mt-3">
            <label className="text-sm min-w-[80px]">Text Style</label>
            <ToggleGroup
                variant="outline"
                type="multiple"
                className="flex items-center gap-2"
                value={value}
                onValueChange={handleChange}
            >
                <ToggleGroupItem value="bold" aria-label="Toggle bold" className={`${baseItemClasses} ${selectedClasses}`}>
                    <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic" className={`${baseItemClasses} ${selectedClasses}`}>
                    <Italic className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}

export default ToggleGroupField
