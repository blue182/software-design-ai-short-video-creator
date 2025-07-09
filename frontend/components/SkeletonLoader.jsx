import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonLoader = ({
    lines = 2,
    avatar = false,
    image = false,
    buttons = 0,
    className = "",
}) => {
    return (
        <div className={`flex flex-col gap-3 p-4 rounded-lg border bg-white shadow ${className}`}>
            {avatar && (
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            )}

            {image && <Skeleton className="w-full h-48 rounded-md" />}

            {Array.from({ length: lines }).map((_, idx) => (
                <Skeleton
                    key={idx}
                    className={`h-4 ${idx % 2 === 0 ? "w-full" : "w-3/4"}`}
                />
            ))}

            {buttons > 0 && (
                <div className="flex gap-2 mt-2">
                    {Array.from({ length: buttons }).map((_, idx) => (
                        <Skeleton key={idx} className="h-8 w-20 rounded-md" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SkeletonLoader;
