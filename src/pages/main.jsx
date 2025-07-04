// import { useState, useEffect } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import Sidebar from "../components/sidebar";
// import { useAuth } from "../context/AuthContext";

// // Import user data files
// import userData from "../data/user.json";
// import mahasiswaData from "../data/mahasiswa.json";
// import dosenData from "../data/dosen.json";
// import mitraData from "../data/mitra.json";

// export default function Main({ role }) {
//     const { user } = useAuth();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [notificationCount, setNotificationCount] = useState(2);
    
//     // Get detailed user information
//     const getUserDetails = () => {
//         if (!user) return null;
        
//         switch(user.role) {
//             case 'Mahasiswa':
//                 return mahasiswaData.MAHASISWA.find(m => m.ID_User === user.id);
//             case 'Dosen':
//                 return dosenData.DOSEN.find(d => d.ID_User === user.id);
//             case 'Mitra':
//                 return mitraData.MITRA.find(m => m.ID_User === user.id);
//             default:
//                 return null;
//         }
//     };
    
//     const userDetails = getUserDetails();
    
//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };


//     return (
//         <div className="flex h-svh w-full relative bg-white">
//             {/* Sidebar */}
//             <div 
//                 className={`fixed md:relative z-10 min-h-screen transition-all duration-300 ease-in-out ${
//                     isSidebarOpen ? "w-64 translate-x-0" : "w-0 md:w-16 -translate-x-full md:translate-x-0"
//                 }`}
//             >
//                 <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={role} />
//             </div>
            
//             {/* Main content area */}
//             <div className=" flex-1 flex flex-col">
//                 {/* Header */}
//                 <header className="bg-white border-b shadow p-4 ">
//                     <div className="flex justify-between items-center">
//                         {/* Left section */}
//                         <div className="flex items-center">
//                             {!isSidebarOpen && (
//                                 <button 
//                                     onClick={toggleSidebar} 
//                                     className="md:hidden p-2 rounded bg-primary hover:bg-primary/70"
//                                     aria-label="Open sidebar"
//                                 >
//                                     <img 
//                                         src="/assets/icons/icons8-hamburger-128.png" 
//                                         alt="Open sidebar"
//                                         className="h-6 w-6"
//                                     />
//                                 </button>
//                             )}

//                             <div className={`text-left ${isSidebarOpen ? "md:block hidden" : "hidden sm:block"}`}>
//                                 {role === 'Mahasiswa' && (
//                                     <>
//                                         <h1 className="text-md lg:text-sm font-bold text-primary">Pusat Mahasiswa</h1>
//                                         <p className="hidden lg:block">Kelola CV & aplikasikan diri ke proyek industri</p>
//                                     </>
//                                 )}
                                
//                                 {role === 'Dosen' && (
//                                     <>
//                                         <h1 className="text-md lg:text-sm font-bold text-primary">Pusat Pembimbing</h1>
//                                         <p className="hidden lg:block">Evaluasi & bimbing proyek capstone mahasiswa</p>
//                                     </>
//                                 )}
                                
//                                 {role === 'Mitra' && (
//                                     <>
//                                         <h1 className="text-md lg:text-sm font-bold text-primary">Pusat Kolaborasi</h1>
//                                         <p className="hidden lg:block">Ajukan proyek & temukan talenta masa depan</p>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
                        
//                         <div className="flex  items-center justify-content-center">
//                         {/* Right section */}
//                         <NavLink
//                             to="settings" 
//                             // onClick={() => setShowProfileModal(true)}
//                             className=" flex items-center gap-0 md:gap-2 ">
//                             {/* Profile picture button */}
//                             <div 
//                                 className="h-10 w-10 rounded-full overflow-hidden   transition-transform hover:scale-105"
//                                 aria-label="View profile"
//                             >
//                                 {userDetails?.Foto_Profile ? (
//                                     <img 
//                                         src={userDetails.Foto_Profile} 
//                                         alt="Profile" 
//                                         className="h-full w-full object-cover"
//                                         loading="lazy"
//                                     />
//                                 ) : (
//                                     <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
//                                         {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                                     </div>
//                                 )}
//                             </div>


//                             {/* User profile */}
//                             <div className="flex items-center">
//                                 <div className="text-left hidden sm:block">
//                                     <div className="font-medium text-gray-900">
//                                         {userDetails ? (
//                                             userDetails.Nama || 
//                                             userDetails.Nama_Perusahaan || 
//                                             user.name
//                                         ) : (
//                                             user?.name || "User"
//                                         )}
//                                     </div>
//                                     <div className="text-sm text-gray-500 capitalize">{role}</div>
//                                 </div>
//                             </div>
//                         </NavLink>
                            
//                             {/* Notification icon */}
//                             <button 
//                                 className="p-2 rounded-full hover:bg-secondary relative"
//                                 aria-label="Notifications"
//                                 >
//                                     <img 
//                                     src="/assets/icons/icons8-notification-100.png" 
//                                     alt=""
//                                     className="h-6 w-6"
//                                 />
//                                 {notificationCount > 0 && (
//                                         <span className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                                             {notificationCount}
//                                         </span>
//                             )}
//                             </button>
//                         </div>

//                     </div>
//                 </header>
                
//                 {/* Main content */}
//                 <div className="flex-1 p-4 h-[calc(100vh-240px)]">
//                     <Outlet />
//                 </div>
//             </div>
            
//             {/* Mobile sidebar overlay */}
//             {isSidebarOpen && (
//                 <div 
//                     className="md:hidden h-full  fixed inset-0 bg-black bg-opacity-50 z-0"
//                     onClick={toggleSidebar}
//                     aria-hidden="true"
//                 ></div>
//             )}
//         </div>
//     );
// }


// v2
import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            // Close sidebar on mobile by default
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initialize on mount

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
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

    return (
        <div className="flex h-screen w-full relative bg-white overflow-hidden">
            {/* Sidebar */}
            <div 
                className={`fixed md:relative z-20 h-screen transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "w-64 translate-x-0" : "w-0 md:w-16 -translate-x-full md:translate-x-0"
                }`}
            >
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={role} />
            </div>
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b shadow p-2 sm:p-4">
                    <div className="flex justify-between items-center">
                        {/* Left section */}
                        <div className="flex items-center gap-2">
                            {(!isSidebarOpen || isMobile) && (
                                <button 
                                    onClick={toggleSidebar} 
                                    className="p-2 rounded bg-primary hover:bg-primary/70"
                                    aria-label="Open sidebar"
                                >
                                    <img 
                                        src="/assets/icons/icons8-hamburger-128.png" 
                                        alt="Open sidebar"
                                        className="h-5 w-5 sm:h-6 sm:w-6"
                                    />
                                </button>
                            )}

                            <div className={`text-left ${isSidebarOpen ? "md:block hidden" : "hidden sm:block"}`}>
                                {role === 'Mahasiswa' && (
                                    <>
                                        <h1 className="text-sm sm:text-md lg:text-sm font-bold text-primary">Pusat Mahasiswa</h1>
                                        <p className="hidden lg:block text-xs sm:text-sm">Kelola CV & aplikasikan diri ke proyek industri</p>
                                    </>
                                )}
                                
                                {role === 'Dosen' && (
                                    <>
                                        <h1 className="text-sm sm:text-md lg:text-sm font-bold text-primary">Pusat Pembimbing</h1>
                                        <p className="hidden lg:block text-xs sm:text-sm">Evaluasi & bimbing proyek capstone mahasiswa</p>
                                    </>
                                )}
                                
                                {role === 'Mitra' && (
                                    <>
                                        <h1 className="text-sm sm:text-md lg:text-sm font-bold text-primary">Pusat Kolaborasi</h1>
                                        <p className="hidden lg:block text-xs sm:text-sm">Ajukan proyek & temukan talenta masa depan</p>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Notification icon */}
                            <button 
                                className="p-1 sm:p-2 rounded-full hover:bg-secondary relative"
                                aria-label="Notifications"
                            >
                                <img 
                                    src="/assets/icons/icons8-notification-100.png" 
                                    alt=""
                                    className="h-5 w-5 sm:h-6 sm:w-6"
                                />
                                {notificationCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                            
                            {/* Profile */}
                            <NavLink
                                to="settings" 
                                className="flex items-center gap-1 sm:gap-2"
                            >
                                {/* Profile picture */}
                                <div 
                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden transition-transform hover:scale-105"
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
                                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm sm:text-xl">
                                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>

                                {/* User profile */}
                                <div className="hidden sm:block">
                                    <div className="text-left">
                                        <div className="text-sm sm:text-base font-medium text-gray-900 line-clamp-1 max-w-[120px] sm:max-w-[150px]">
                                            {userDetails ? (
                                                userDetails.Nama || 
                                                userDetails.Nama_Perusahaan || 
                                                user.name
                                            ) : (
                                                user?.name || "User"
                                            )}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500 capitalize">{role}</div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </header>
                
                {/* Main content */}
                <main className="flex-1 p-2 sm:p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
            
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && isMobile && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}