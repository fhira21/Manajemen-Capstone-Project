import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

export default function Main() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen relative">
            {/* Sidebar with transition */}
            <div 
                className={`fixed md:relative z-10 h-screen transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "w-64 translate-x-0" : "w-0 md:w-16 -translate-x-full md:translate-x-0"
                }`}
            >
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            
            {/* Toggle button for mobile - Only visible when sidebar is closed */}
            {!isSidebarOpen && (
                <button 
                    onClick={toggleSidebar} 
                    className="md:hidden fixed top-4 left-4 z-20 p-2 bg-primary text-white rounded-full shadow-lg"
                    aria-label="Open sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}
            
            {/* Content area */}
            <div className="flex-1 p-4 transition-all duration-300">
                <Outlet /> {/* Content area */}
            </div>
            
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                ></div>
            )}
        </div>
    );
}