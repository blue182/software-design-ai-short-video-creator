"use client";
import React, { useState } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";

function Dashboard() {
    const [videoList, setVideoList] = useState([]);
    return (
        <div className="md:px-20 mt-5 px-7 py-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
                <Link href="/dashboard/create-new">
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap">
                        Create New Video
                    </button>
                </Link>
            </div>
            {videoList?.length == 0 && <div>
                <EmptyState />
            </div>}
        </div>
    );
}

export default Dashboard;