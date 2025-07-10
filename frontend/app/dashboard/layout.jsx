"use client";
import React from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";

function DashboardLayout({ children }) {
    const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
    return (

        <div>
            {/* Header cố định */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header onToggleSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />
            </div>

            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${isMobileSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setMobileSidebarOpen(false)}
            >
                <div
                    className={`pt-[80px] absolute left-0 top-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SideNav />
                </div>
            </div>



            <div className="pt-[80px] min-h-screen flex">
                {/* Sidebar với position sticky thay vì fixed */}
                <aside className="hidden md:block sticky top-[80px] h-[calc(100vh-80px)] bg-white z-30 min-w-[200px] max-w-[250px] w-[20vw] border-r">
                    <SideNav />
                </aside>

                {/* Content area */}
                <main className="flex-1 overflow-x-hidden px-4 py-6">
                    {children}
                </main>
            </div>

        </div>
    );
}

export default DashboardLayout;