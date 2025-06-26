import Link from 'next/link'
import React from 'react'

function EmptyState() {
    return (
        <div className="w-full flex flex-col items-center mt-20 gap-4 border-2 border-dashed border-gray-300 px-10 py-24 rounded-lg">

            <h2>You don't have any short video created</h2>
            <p className="text-gray-500">Create your first short video to get started.</p>
            <Link href={"/dashboard/create-new"}>
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Create New Video
                </button>
            </Link>
        </div>
    )
}

export default EmptyState