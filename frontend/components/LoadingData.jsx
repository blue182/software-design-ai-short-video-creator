import React from 'react'

function LoadingData() {
    return (
        <div className="mt-2 flex flex-col justify-center items-center gap-4 py-2">
            <div
                className="w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"
                style={{
                    borderTopColor: "transparent",
                    borderRightColor: "#00BFFF",
                    borderBottomColor: "#1E90FF",
                    borderLeftColor: "#000080",
                }}
            ></div>

            <span className="text-primary-500 font-medium text-base">Loading...</span>

        </div>
    )
}

export default LoadingData;