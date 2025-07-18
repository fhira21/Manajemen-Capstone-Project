
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Sidebar({ isOpen, toggleSidebar, role }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Menu untuk Mahasiswa
  const mahasiswaMenu = [
    { to: "dashboard", icon: "/assets/icons/icons8-home-100.png", label: "Dashboard" },
    { to: "curriculum-vitae", icon: "/assets/icons/icons8-cv-100.png", label: "Curriculum Vitae" },
    { to: "project-selection", icon: "/assets/icons/icons8-project-management-100.png", label: "Pemilihan Proyek" },
  ];

  // Menu untuk Dosen
  const dosenMenu = [
    { to: "dashboard", icon: "/assets/icons/icons8-home-100.png", label: "Dashboard" },
    { to: "proposal-partner", icon: "/assets/icons/icons8-proposal-paper-100.png", label: "Proposal Mitra" },
    { to: "student-data", icon: "/assets/icons/icons8-student-datar-90.png", label: "Data Mahasiswa" },
    { to: "student-list-register", icon: "/assets/icons/icons8-list-student-register-64.png", label: "Mahasiswa Pendaftar" },
    { to: "progres-project", icon: "/assets/icons/icons8-graph-progress-100.png", label: "Progress Proyek" },
  ];

  // Menu untuk Mitra
  const mitraMenu = [
    { to: "dashboard", icon: "/assets/icons/icons8-home-100.png", label: "Dashboard" },
    { to: "form-pengajuan-projek", icon: "/assets/icons/icons8-project-management-100.png", label: "Ajukan Proyek Baru" },
    { to: "project-selection", icon: "/assets/icons/icons8-list-view-select-proyek-96.png", label: "Manajemen Proyek" },

  ];

  // Pilih menu berdasarkan role
  let menuItems = [];
  switch(role) {
    case 'Mahasiswa':
      menuItems = mahasiswaMenu;
      break;
    case 'Dosen':
      menuItems = dosenMenu;
      break;
    case 'Mitra':
      menuItems = mitraMenu;
      break;
    default:
      menuItems = [];
  }

  // Handle logout
  const handleLogout = () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
      window.location.href = "/login";
    }
  };

  return (
    <div className={`w-full h-full flex flex-col items-center justify-between bg-primary overflow-hidden`}>
      {/* Header with logo and toggle button */}
      <div className={`w-full flex flex-col items-center border-b p-2 gap-2 sm:gap-5`}>
        {/*  Toggle button */}
          <div className={`flex items-center w-full ${isOpen ? 'p-1 sm:p-2 justify-end' : 'justify-center'}`}>
            <button 
              onClick={toggleSidebar}
              className={`hidden md:flex hover:bg-secondary/20 rounded transition-colors ${isOpen ? 'p-2' : 'p-2'}`}
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <img 
                src="/assets/icons/icons8-hamburger-128.png" 
                alt={isOpen ? "Collapse sidebar" : "Expand sidebar"} 
                className="h-6 w-6 sm:h-8 sm:w-8" 
              />
            </button>
          </div>
          
          <div className={`${isOpen ? 'p-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24' : 'hidden'} rounded-full flex items-center justify-center `} style={{ background: 'linear-gradient(135deg, #8EAFDA 0%, #1C6ED8 100%)' }}>
            <Logo className="w-full h-full" />
          </div>

          {isOpen && <h1 className="w-full text-center text-white text-lg sm:text-xl font-bold">Manajemen Capstone</h1>}
              </div>

              {/* Scrollable container for navigation menus */}
      <div className="flex-grow w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
        <ul className="w-full flex flex-col gap-1 sm:gap-2 p-1 sm:p-2">
          {menuItems.map((item, index) => (
            <li key={index} className="w-full rounded">
              <NavLink 
                to={item.to} 
                className={({isActive}) => 
                  `flex items-center gap-2 text-white ${
                    isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                  } ${!isOpen && 'md:justify-center'}`
                }
              >
                <img src={item.icon} alt={`${item.label} Icon`} className="w-5 h-5 sm:w-6 sm:h-6" />
                {isOpen && <span className="text-sm sm:text-base">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom section */}
      <div className="w-full">
        {/* Setting Link - only show for non-Mahasiswa and Mitra roles */}
        {(
          <ul className="w-full flex flex-col gap-1 sm:gap-2 p-1 sm:p-2">
            <li className="w-full rounded">
              <NavLink 
                to="settings" 
                className={({isActive}) => 
                  `flex items-center gap-2 text-white ${
                    isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                  } ${!isOpen && 'md:justify-center'}`
                }
              >
                <img src="/assets/icons/icons8-setting-100.png" alt="Pengaturan Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
                {isOpen && <span className="text-sm sm:text-base">Pengaturan</span>}
              </NavLink>
            </li>
          </ul>
        )}

        {/* Logout Button */}
        <ul className="w-full flex flex-col gap-1 sm:gap-2 p-1 sm:p-2">
          <li className="w-full rounded">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-2 text-white hover:bg-secondary p-2 rounded w-full ${!isOpen && 'md:justify-center'}`}
            >
              <img src="/assets/icons/icons8-log-out-100.png" alt="Keluar Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
              {isOpen && <span className="text-sm sm:text-base">Keluar</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}