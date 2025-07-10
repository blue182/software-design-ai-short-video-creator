"use client"

import React, { useEffect, useRef } from 'react'
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

const VIDEO_SIZE_OPTIONS = {
    "9:16": { width: 720, height: 1280 },
    "1:1": { width: 1080, height: 1080 },
    "16:9": { width: 1280, height: 720 }
}

function SelectVideoSize({ selected, onUserSelect }) {
    const [optionSize, setOptionSize] = React.useState([]);

    return (
        <div >
            <h2 className="font-bold text-primary text-base sm:text-base md:text-lg lg:text-xl">Video Size</h2>
            <p className="text-sm sm:text-sm md:text-base text-gray-500 mb-2">Choose the aspect ratio for your video</p>

            <ToggleGroup
                type="single"
                variant="outline"
                value={selected?.aspect || "9:16"}
                onValueChange={(val) => {
                    if (!val) return;
                    const option = VIDEO_SIZE_OPTIONS[val];
                    onUserSelect('video_size', { aspect: val, width: option.width, height: option.height });
                }}
                className="flex gap-6 mt-2 flex-wrap items-center justify-center"
            >
                {Object.entries(VIDEO_SIZE_OPTIONS).map(([label]) => (
                    <ToggleGroupItem key={label} value={label} className={`
                            px-6 py-2 rounded-lg border-2 text-base font-medium
                            border-gray-300
                            data-[state=on]:bg-primary-50
                            data-[state=on]:border-primary
                            data-[state=on]:text-primary
                            transition-all duration-200
                        `}>
                        {label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    )
}

export default SelectVideoSize;
