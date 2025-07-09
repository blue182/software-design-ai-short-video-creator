"use client";
import React, { useState } from "react";
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

            {
                hasError && (
                    <p className="text-red-500 text-sm mt-2">Please select a topic.</p>
                )
            }
        </div >
    );
}

export default SelectTopic;
