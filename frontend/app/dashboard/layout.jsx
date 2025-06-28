import React from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";

function DashboardLayout({ children }) {
    return (

        <div>
            {/* Header cố định */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            <div className="flex pt-[80px]"> {/* Đẩy content xuống dưới Header */}
                {/* Sidebar cố định */}
                <div className="hidden md:block fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-white z-40 min-w-[200px] max-w-[250px] w-[20vw] border-r">
                    <SideNav />
                </div>

                {/* Content co giãn */}
                <div className="flex-1 ml-0 md:ml-[20vw] overflow-x-auto">
                    {children}
                </div>

            </div>
        </div>
    );
}

export default DashboardLayout;