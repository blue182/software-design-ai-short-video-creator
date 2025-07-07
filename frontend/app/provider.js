// "use client";

// import { useUser } from '@clerk/nextjs';
// import React, { useEffect } from 'react';
// import { db } from '@/configs/db';
// import { users } from '@/configs/schemas/users';
// import { eq } from 'drizzle-orm';

// function Provider({ children }) {

//     const { user } = useUser();

//     useEffect(() => {
//         user && isNewUser();
//     }, [user]);

//     const isNewUser = async () => {
//         const result = await db.select().from(users)
//             .where(eq(users.email, user?.primaryEmailAddress?.emailAddress))


//         console.log(result)
//         if (!result[0]) {
//             await db.insert(users).values({
//                 email: user?.primaryEmailAddress?.emailAddress,
//                 username: user?.fullName,
//                 avatar_url: user?.imageUrl,
//             });
//         }
//     }

//     return (<div>
//         {children}
//     </div>)

// }

// export default Provider;


// app/provider.js
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { VideoFrameContext } from "./_contexts/VideoFrameContext";

export default function Provider({ children }) {
    const { user } = useUser();
    const [videoFrames, setVideoFrames] = useState([]);

    useEffect(() => {
        if (user) {
            checkOrCreateUser();
        }
    }, [user]);

    const checkOrCreateUser = async () => {
        try {
            await fetch("/api/user/check-or-create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user?.primaryEmailAddress?.emailAddress,
                    username: user?.fullName,
                    avatar_url: user?.imageUrl,
                }),
            });
        } catch (err) {
            console.error("❌ Failed to check/create user", err);
        }
    };

    return (
        <div>
            <VideoFrameContext.Provider value={{ videoFrames, setVideoFrames }}>
                {children}
            </VideoFrameContext.Provider>
        </div>
    );
}
