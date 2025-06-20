import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { useAuth } from "../context/AuthContext";

// Import user data files
import userData from "../data/user.json";
import mahasiswaData from "../data/mahasiswa.json";
import dosenData from "../data/dosen.json";
import mitraData from "../data/mitra.json";

export default function Main({ role }) {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [notificationCount, setNotificationCount] = useState(2);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    
    // Get detailed user information
    const getUserDetails = () => {
        if (!user) return null;
        
        switch(user.role) {
            case 'Mahasiswa':
                return mahasiswaData.MAHASISWA.find(m => m.ID_User === user.id);
            case 'Dosen':
                return dosenData.DOSEN.find(d => d.ID_User === user.id);
            case 'Mitra':
                return mitraData.MITRA.find(m => m.ID_User === user.id);
            default:
                return null;
        }
    };
    
    const userDetails = getUserDetails();
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Smooth modal closing animation
    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowProfileModal(false);
            setIsClosing(false);
        }, 200);
    };

    // Close modal with ESC key and prevent body scroll
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (showProfileModal) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [showProfileModal]);

    return (
        <div className="flex min-h-screen relative">
            {/* Sidebar */}
            <div 
                className={`fixed md:relative z-10 min-h-screen transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "w-64 translate-x-0" : "w-0 md:w-16 -translate-x-full md:translate-x-0"
                }`}
            >
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={role} />
            </div>
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-md p-4">
                    <div className="flex justify-between items-center">
                        {/* Left section */}
                        <div className="flex items-center">
                            {!isSidebarOpen && (
                                <button 
                                    onClick={toggleSidebar} 
                                    className="md:hidden mr-3 p-2 rounded bg-primary hover:bg-secondary"
                                    aria-label="Open sidebar"
                                >
                                    <img 
                                        src="/assets/icons/icons8-sidebar-open-100.png" 
                                        alt="Open sidebar"
                                        className="h-6 w-6"
                                    />
                                </button>
                            )}

                            <div className={`text-left ${isSidebarOpen ? "md:block hidden" : "hidden sm:block"}`}>
                                {role === 'Mahasiswa' && (
                                    <>
                                        <h1 className="text-md lg:text-sm font-bold text-primary">Pusat Mahasiswa</h1>
                                        <p className="hidden lg:block">Kelola CV & aplikasikan diri ke proyek industri</p>
                                    </>
                                )}
                                
                                {role === 'Dosen' && (
                                    <>
                                        <h1 className="text-md lg:text-sm font-bold text-primary">Pusat Pembimbing</h1>
                                        <p className="hidden lg:block">Evaluasi & bimbing proyek capstone mahasiswa</p>
                                    </>
                                )}
                                
                                {role === 'Mitra' && (
                                    <>
                                        <h1 className="text-md lg:text-sm font-bold text-primary">Pusat Kolaborasi</h1>
                                        <p className="hidden lg:block">Ajukan proyek & temukan talenta masa depan</p>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* Right section */}
                        <div className="flex items-center space-x-4">


                            
                            {/* Profile picture button */}
                            <button 
                                onClick={() => setShowProfileModal(true)}
                                className="h-10 w-10 rounded-full overflow-hidden   transition-transform hover:scale-105"
                                aria-label="View profile"
                            >
                                {userDetails?.Foto_Profile ? (
                                    <img 
                                        src={userDetails.Foto_Profile} 
                                        alt="Profile" 
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </button>


                            {/* User profile */}
                            <div className="flex items-center">
                                <div className="mr-3 text-left hidden sm:block">
                                    <div className="font-medium text-gray-900">
                                        {userDetails ? (
                                            userDetails.Nama || 
                                            userDetails.Nama_Perusahaan || 
                                            user.name
                                        ) : (
                                            user?.name || "User"
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 capitalize">{role}</div>
                                </div>
                            </div>
                            
                            {/* Notification icon */}
                            <div className="relative">
                                <button 
                                    className="p-2 rounded-full hover:bg-secondary relative"
                                    aria-label="Notifications"
                                >
                                    <img 
                                        src="/assets/icons/icons8-notification-100.png" 
                                        alt=""
                                        className="h-6 w-6"
                                    />
                                    {notificationCount > 0 && (
                                        <span className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {notificationCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                            

                        </div>
                    </div>
                </header>
                
                {/* Main content */}
                <div className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </div>
            </div>
            
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div 
                    className="md:hidden h-full  fixed inset-0 bg-black bg-opacity-50 z-0"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                ></div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <div 
                    className={`fixed  inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
                        isClosing ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
                        onClick={closeModal}
                        aria-hidden="true"
                    />

                    {/* Modal Content */}
                    <div className="relative z-10">
                        {/* Close Button */}
                        <button 
                            onClick={closeModal}
                            className="absolute -top-12 -right-2 text-white hover:text-gray-300 focus:outline-none"
                            aria-label="Close profile"
                        >
                        </button>

                        {/* Profile Image */}
                        <div className="relative group">
                            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4  shadow-xl">
                                {userDetails?.Foto_Profile ? (
                                    <img 
                                        src={userDetails.Foto_Profile} 
                                        alt="Profile" 
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-8xl">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>

                            {/* Hover effect */}
                            <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-secondary transition-all duration-300 pointer-events-none" />
                        </div>
                        

                        {/* User profile */}
                        <div className=" p-2 text-center ">
                            <div className="font-bold text-white">
                                {userDetails ? (
                                    userDetails.Nama || 
                                    userDetails.Nama_Perusahaan || 
                                    user.name
                                ) : (
                                    user?.name || "User"
                                )}
                            </div>
                            <div className="text-md text-secondary capitalize">{role}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}