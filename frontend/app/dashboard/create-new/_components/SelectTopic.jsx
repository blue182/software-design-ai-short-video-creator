// "use client"
// import React, { useState } from 'react'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"

// function SelectTopic({ onUserSelect, selected, hasError }) {
//     const options = [
//         'Custom Prompt', 'Random AI Story', 'Scary Story', 'Funny Story',
//         'Motivational Story', 'Romantic Story', 'Horror Story',
//         'Adventure Story', 'Mystery Story', 'Science Fiction Story',
//         'Fantasy Story', 'Historical Story', 'Thriller Story', 'Drama Story',
//         'Comedy Story', 'Action Story', 'Animated Story', 'Documentary Story'
//     ]

//     const [selectedOption, setSelectedOption] = useState('');
//     const isCustom = selected?.isCustomTopic === true;
//     const [customValue, setCustomValue] = useState(isCustom ? selected?.value : "");

//     return (
//         <div>
//             <h2 className="font-bold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl">Content</h2>

//             <p className="text-sm sm:text-base md:text-lg text-gray-500">What is the topic of your video?</p>

//             <Select

//                 value={!isCustom ? selected?.topic : 'Custom Prompt'}
//                 onValueChange={(value) => {
//                     setSelectedOption(value);

//                     value !== 'Custom Prompt' ? onUserSelect('topic', { topic: value, isCustomTopic: false }) : onUserSelect('topic', { topic: customValue, isCustomTopic: true });
//                 }} >
//                 <SelectTrigger
//                     className={`w-full mt-2 p-6 text-sm sm:text-base md:text-lg lg:text-xl border ${hasError ? 'border-red-500' : 'border-gray-300'}`}

//                 >
//                     <SelectValue placeholder="Select content type" className="[&[data-placeholder]]:text-gray-400" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {options.map((option, index) => (
//                         <SelectItem key={index} value={option} >
//                             <span className="text-sm sm:text-base md:text-base lg:text-lg">
//                                 {option}
//                             </span>
//                         </SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>

//             {(selectedOption === 'Custom Prompt' || selected?.isCustomTopic) && (
//                 <div>

//                     <Textarea value={selected?.topic || ''} className="mt-5 text-sm sm:text-base md:text-base lg:text-lg" placeholder="Write prompt on which you want to generate video"
//                         onChange={(e) => {
//                             const value = e.target.value;
//                             setCustomValue(value);
//                             onUserSelect('topic', { topic: value, isCustomTopic: true });
//                         }} />

//                 </div>
//             )}
//             {hasError && (
//                 <p className="text-red-500 text-sm mt-2">Please select a topic.</p>
//             )}

//         </div>
//     )
// }

// export default SelectTopic




"use client";
import React, { useEffect, useState } from "react";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function SelectTopic({ onUserSelect, selected, hasError }) {
    const options = [
        "Random AI Story", "Scary Story", "Funny Story",
        "Motivational Story", "Romantic Story", "Horror Story",
        "Adventure Story", "Mystery Story", "Science Fiction Story",
        "Fantasy Story", "Historical Story", "Thriller Story", "Drama Story",
        "Comedy Story", "Action Story", "Animated Story", "Documentary Story"
    ];

    const isCustomInit = selected?.isCustomTopic === true;
    const [mode, setMode] = useState(isCustomInit ? "custom" : "predefined");
    const [customValue, setCustomValue] = useState(isCustomInit ? selected?.topic : "");

    //add gen trends
    const [trends, setTrends] = useState([]);
    const [loadingTrends, setLoadingTrends] = useState(false);

    useEffect(() => {
        if (mode === "trends") {
            setLoadingTrends(true);
            fetch("http://localhost:8000/api/trends")
                .then(res => res.json())
                .then(data => {
                    setTrends(data.keywords || []);
                })
                .catch(err => {
                    console.error("Failed to fetch trends:", err);
                    setTrends([]);
                })
                .finally(() => {
                    setLoadingTrends(false);
                });
        }
    }, [mode]);


    return (
        <div >
            <h2 className="font-bold text-primary text-lg sm:text-md md:text-lg lg:text-xl">
                Content
            </h2>
            <p className="text-sm sm:text-base md:text-md text-gray-500 mb-2">
                Choose a content type or write your own
            </p>

            {/* Toggle Group to switch mode */}
            <div className="flex flex-start">
                <ToggleGroup
                    type="single"
                    value={mode}
                    onValueChange={(val) => {
                        if (!val) return;
                        setMode(val);
                        if (val === "predefined" && !options.includes(selected?.topic)) {
                            // Reset if switching from custom with invalid topic
                            onUserSelect("topic", { topic: "", isCustomTopic: false });
                        }
                    }}
                    className="flex gap-0 mt-2 mb-2"
                >
                    <ToggleGroupItem
                        value="predefined"
                        className="px-6 py-4 border text-base font-bold
                   rounded-l-sm rounded-r-none
                   data-[state=on]:bg-primary-50
                   data-[state=on]:border-primary
                   data-[state=on]:text-primary"
                    >
                        Predefined Topic
                    </ToggleGroupItem>

                    <ToggleGroupItem
                        value="custom"
                        className="px-6 py-4 border text-base font-bold
                   rounded-r-sm rounded-l-none
                   data-[state=on]:bg-primary-50
                   data-[state=on]:border-primary
                   data-[state=on]:text-primary"
                    >
                        Custom Prompt
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                        value="trends" 
                        className="px-6 py-4 border text-base font-bold
                   rounded-r-sm rounded-l-none
                   data-[state=on]:bg-primary-50
                   data-[state=on]:border-primary
                   data-[state=on]:text-primary">
                        Random Trends
                    </ToggleGroupItem>
                </ToggleGroup>

            </div>
            {/* Predefined Select */}
            {
                mode === "predefined" && (
                    <Select
                        value={selected?.topic || ""}
                        onValueChange={(value) => {
                            onUserSelect("topic", { topic: value, isCustomTopic: false });
                        }}
                    >
                        <SelectTrigger
                            className={`w-full p-6 text-sm sm:text-base md:text-base lg:text-lg border ${hasError ? "border-red-500" : "border-gray-300"}`}
                        >
                            <SelectValue placeholder="Select content type" className="[&[data-placeholder]]:text-gray-400" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option, index) => (
                                <SelectItem key={index} value={option}>
                                    <span className="text-sm sm:text-base md:text-md lg:text-lg">{option}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            }

            {/* Custom Prompt Textarea */}
            {
                mode === "custom" && (
                    <Textarea
                        value={selected?.topic || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setCustomValue(value);
                            onUserSelect("topic", { topic: value, isCustomTopic: true });
                        }}
                        className="text-sm sm:text-base md:text-base lg:text-lg border border-primary-100 focus:border-primary-200 focus:ring-primary-200"
                        placeholder="Write the prompt for your video"
                    />
                )
            }
            {/* Random Trends */}
            {mode === "trends" && (
                <>
                    {loadingTrends ? (
                        <p className="text-gray-500 mt-2">Loading trends...</p>
                    ) : (
                        <Select
                            value={selected?.topic || ""}
                            onValueChange={(value) => {
                                onUserSelect("topic", { topic: value, isCustomTopic: false });
                            }}
                        >
                            <SelectTrigger className={`w-full p-6 text-sm sm:text-base md:text-base lg:text-lg border ${hasError ? "border-red-500" : "border-gray-300"}`}>
                                <SelectValue placeholder="Select a trending keyword" />
                            </SelectTrigger>
                            <SelectContent>
                                {trends.map((trend, index) => (
                                    <SelectItem key={index} value={trend}>
                                        <span className="text-sm sm:text-base md:text-md lg:text-lg">{trend}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </>
            )}
            {
                hasError && (
                    <p className="text-red-500 text-sm mt-2">Please select a topic.</p>
                )
            }
        </div >
    );
}

export default SelectTopic;
