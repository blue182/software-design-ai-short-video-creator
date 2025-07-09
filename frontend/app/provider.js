"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { VideoFrameContext } from "./_contexts/VideoFrameContext";
import { UserDetailContext } from "./_contexts/UserDetailContext";
import { ListVideosContext } from "./_contexts/ListVideosContext";
import { List, ListVideo } from "lucide-react";

export default function Provider({ children }) {
    const { user } = useUser();
    const [videoFrames, setVideoFrames] = useState({});
    const [listVideos, setListVideos] = useState({});
    const [userDetail, setUserDetail] = useState(null);

    useEffect(() => {
        if (user) {
            checkOrCreateUser();
        }
    }, [user]);

    const checkOrCreateUser = async () => {
        try {
            const res = await fetch("/api/user/check-or-create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clerk_id: user?.id,
                    email: user?.primaryEmailAddress?.emailAddress,
                    username: user?.fullName,
                    avatar_url: user?.imageUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("❌ API error:", data.error);
                return;
            }

            if (data.ok && data.user) {
                setUserDetail(data.user); // ✅ Lưu user vào context
            } else {
                console.warn("⚠️ API did not return user info.");
            }
        } catch (err) {
            console.error("❌ Failed to check/create user", err);
        }
    };

    return (
        <div>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                <ListVideosContext.Provider value={{ listVideos, setListVideos }}>
                    <VideoFrameContext.Provider value={{ videoFrames, setVideoFrames }}>
                        {children}
                    </VideoFrameContext.Provider>
                </ListVideosContext.Provider>
            </UserDetailContext.Provider >
        </div>
    );
}
