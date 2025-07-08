import PageTitle from '../components/PageTitle';
import Logo from '../components/Logo';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCategoryColor } from '../utils/categoryColors';
import projectData from '../data/project.json';

const roles = [
  {
    name: 'Mahasiswa',
    desc: 'Kelola proyek, kolaborasi tim, dan pantau progres tugas Anda.',
    icon: '/assets/icons/icons8-student-datar-90.png',
    to: '/student/dashboard',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Dosen',
    desc: 'Pantau kemajuan mahasiswa, review proposal, dan bimbing tim.',
    icon: '/assets/icons/icons8-manage-account-100.png',
    to: '/lecturer/dashboard',
    color: 'bg-green-100 text-green-700',
  },
  {
    name: 'Mitra',
    desc: 'Ajukan proyek, kolaborasi dengan kampus, dan rekrut talenta.',
    icon: '/assets/icons/icons8-project-management-100.png',
    to: '/partner/dashboard',
    color: 'bg-yellow-100 text-yellow-700',
  },
];

function getFeaturedTechnologies() {
  // Ambil 8 teknologi unik dari semua proyek
  const allTechs = (projectData.PROJECT || []).flatMap(p => p.Teknologi || []);
  return Array.from(new Set(allTechs)).slice(0, 8);
}

export default function LandingPage() {
  const [userRole, setUserRole] = useState(null);
  const [featuredTechs, setFeaturedTechs] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) setUserRole(role);
    setFeaturedTechs(getFeaturedTechnologies());
  }, []);

  return (
    <>
      <PageTitle
        title="Management Capstone"
        description="Platform kolaborasi proyek capstone modern untuk mahasiswa, dosen, dan mitra industri."
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-blue-900 text-white">
        {/* Hero Section */}
        <header className="w-full flex flex-col items-center justify-center pt-12 pb-8 px-4">
          <Logo className="w-20 h-20 mb-4 drop-shadow-lg" />
          <h1 className="text-3xl sm:text-5xl font-black mb-2 text-center drop-shadow">Management Capstone</h1>
          <p className="text-lg sm:text-2xl font-medium text-center max-w-2xl mb-6 opacity-90">Platform kolaborasi proyek capstone modern untuk mahasiswa, dosen, dan mitra industri.</p>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {userRole ? (
              <NavLink
                to={
                  userRole.toLowerCase() === 'dosen' ? '/lecturer/dashboard' :
                  userRole.toLowerCase() === 'mahasiswa' ? '/student/dashboard' :
                  userRole.toLowerCase() === 'mitra' ? '/partner/dashboard' :
                  `/${userRole.toLowerCase()}/dashboard`
                }
                className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-secondary-dark transition-colors"
              >
                Go to Dashboard
              </NavLink>
            ) : (
              <>
                <NavLink to="/login" className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-secondary-dark transition-colors">Login</NavLink>
                <NavLink to="/register" className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-secondary-dark transition-colors">Register</NavLink>
              </>
            )}
          </div>
        </header>

        {/* Features Section */}
        <section className="w-full max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <img src="/assets/icons/icons8-project-management-100.png" alt="Project" className="w-12 h-12 mb-2" />
            <h3 className="text-lg font-bold mb-1">Manajemen Proyek</h3>
            <p className="text-sm opacity-80">Kelola seluruh siklus proyek capstone: proposal, tim, progres, dan milestone.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <img src="/assets/icons/icons8-graph-progress-100.png" alt="Dashboard" className="w-12 h-12 mb-2" />
            <h3 className="text-lg font-bold mb-1">Dashboard Interaktif</h3>
            <p className="text-sm opacity-80">Pantau progres, statistik tugas, dan aktivitas tim secara real-time.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <img src="/assets/icons/icons8-list-view-select-proyek-96.png" alt="Kolaborasi" className="w-12 h-12 mb-2" />
            <h3 className="text-lg font-bold mb-1">Kolaborasi Multi-Role</h3>
            <p className="text-sm opacity-80">Mahasiswa, dosen, dan mitra industri terhubung dalam satu platform.</p>
          </div>
        </section>


        {/* Roles Section */}
        <section className="w-full max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {roles.map(role => (
            <div key={role.name} className={`rounded-xl p-6 flex flex-col items-center text-center shadow-lg ${role.color} bg-opacity-80`}>
              <img src={role.icon} alt={role.name} className="w-12 h-12 mb-2" />
              <h3 className="text-lg font-bold mb-1">{role.name}</h3>
              <p className="text-sm opacity-90 mb-3">{role.desc}</p>
              <NavLink to={role.to} className="bg-primary text-white px-4 py-1.5 rounded shadow hover:bg-blue-800 transition-colors font-semibold text-xs">Masuk sebagai {role.name}</NavLink>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="w-full text-center py-6 text-xs text-white/70 mt-auto">
          &copy; {new Date().getFullYear()} Management Capstone. All rights reserved.
        </footer>
      </div>
    </>
  );
}