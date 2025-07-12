"use client"
import { CircleUserRound, FileVideo, PanelsTopLeft, PersonStandingIcon, VideoIcon, ChartNoAxesCombined } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideNav() {
    const MenuOption = [
        {
            id: 1,
            name: 'Dashboard',
            path: '/dashboard',
            icon: PanelsTopLeft,
        },
        {
            id: 2,
            name: 'Create New Video',
            path: '/dashboard/create-new',
            icon: FileVideo,
        },
        // {
        //     id: 3,
        //     name: 'Account',
        //     path: '/account',
        //     icon: CircleUserRound
        // },
        {
            id: 4,
            name: 'View statistics',
            path: '/dashboard/statistics',
            icon: ChartNoAxesCombined,
        },
    ]

    const path = usePathname();
    return (
        <aside
            className="h-full w-full overflow-y-auto px-4 py-6 border-r bg-white"
        >
            <nav className="flex flex-col gap-3">
                {MenuOption.map((item) => {
                    const isActive = path === item.path;
                    return (
                        <Link href={item.path} key={item.id}>
                            <div
                                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-200
                  ${isActive
                                        ? "bg-primary text-white"
                                        : "hover:bg-primary/10 text-gray-800"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium text-sm sm:text-sm md:text-base lg:text-lg">
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    )
}

export default SideNav