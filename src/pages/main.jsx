import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

export default function Main() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className=" flex min-h-screen relative">
            {/* Sidebar with transition */}
            <div 
                className={`fixed md:relative z-10 h-screen transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "w-64 translate-x-0" : "w-0 md:w-16 -translate-x-full md:translate-x-0"
                }`}
            >
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            
            {/* Toggle button for mobile */}
            <button 
                onClick={toggleSidebar} 
                className="md:hidden fixed top-4 left-4 z-20 p-2 bg-primary text-white rounded-full shadow-lg"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                {isSidebarOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>
            
            {/* Content area that expands when sidebar collapses */}
            <div className={`bg-primary `}>
                {/* Toggle button for desktop */}
                <button 
                    onClick={toggleSidebar}
                    className="hidden md:flex mb-4 p-2 bg-primary text-white rounded-md  hover:bg-secondary transition-colors"
                    aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    {isSidebarOpen && <span className="ml-2"> hide </span>}
                </button>
                
            </div>
            
            <div className="flex-1 p-4 bg-red-400 ">
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