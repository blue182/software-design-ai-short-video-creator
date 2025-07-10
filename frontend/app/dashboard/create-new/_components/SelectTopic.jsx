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
import { FileText, PenLine, Flame } from 'lucide-react';


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

    }, []);


    return (
        <div >
            <h2 className="font-bold text-primary text-base sm:text-base md:text-lg lg:text-xl">
                Content
            </h2>
            <p className="text-sm sm:text-sm md:text-base text-gray-500 mb-2">
                Choose a content type or write your own
            </p>

            {/* Toggle Group to switch mode */}
            <div className="flex gap-0 mt-2 mb-2 flex-wrap items-center justify-start">
                <ToggleGroup
                    type="single"
                    value={mode}
                    onValueChange={(val) => {
                        if (!val) return;
                        setMode(val);
                        if (val === "predefined" && !options.includes(selected?.topic)) {
                            onUserSelect("topic", { topic: "", isCustomTopic: false });
                        }
                    }}
                    className="flex mt-2 mb-4 flex-wrap items-center justify-start"

                >
                    <ToggleGroupItem
                        value="predefined"
                        className="px-6 py-4 border text-sm md:text-base xl:text-lg  font-bold flex items-center gap-2
                   rounded-sm
                   data-[state=on]:bg-primary-50
                   data-[state=on]:border-primarytext-sm md:text-base xl:text-lg
                   data-[state=on]:text-primary"
                    >
                        <FileText className="w-5 h-5 text-fuchsia-500" />
                        Predefined Topic
                    </ToggleGroupItem>

                    <ToggleGroupItem
                        value="custom"
                        className="px-6 py-4 border text-sm md:text-base xl:text-lg font-bold flex items-center gap-2
                    rounded-sm
                   data-[state=on]:bg-primary-50
                   data-[state=on]:border-primary
                   data-[state=on]:text-primary "
                    >
                        <PenLine className="w-5 h-5 text-emerald-500" />
                        Custom Prompt
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="trends"
                        className="px-6 py-4 border text-sm md:text-base xl:text-lg font-bold flex items-center gap-2
                   rounded-sm
                   data-[state=on]:bg-primary-50
                   data-[state=on]:border-primary
                   data-[state=on]:text-primary">
                        <Flame className="w-5 h-5 text-red-500" />
                        Trending Topics
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
