import SkeletonLoader from "@/components/SkeletonLoader";

export default function VideoListSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader
                    key={index}
                    image
                    lines={2}
                    buttons={0}
                    className="h-[280px]"
                />
            ))}
        </div>
    );
}
