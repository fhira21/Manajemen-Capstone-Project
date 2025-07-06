import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../../components/mitra/ProjectCard'; 

// Contoh data - di aplikasi nyata, data ini akan diambil dari API
const mockProjects = [
  {
    id: 1,
    title: 'Aplikasi Kasir UMKM',
    company: 'Pt. Maju Teknologi',
    description: 'Pengembangan aplikasi kasir untuk usaha UMKM kecil',
    status: 'Review',
    tech: ['Firebase', 'React'],
  },
  {
    id: 2,
    title: 'Desain UI Layanan Baca',
    company: 'Startup EduTech',
    description: 'Pembuatan desain antarmuka untuk layanan baca',
    status: 'Review',
    tech: ['Python', 'Django'],
  },
  {
    id: 3,
    title: 'Sistem Sentimen Media Sosial',
    company: 'Pt. Datainsight',
    description: 'Menganalisis sentimen pengguna di media sosial',
    status: 'Pending',
    tech: ['Figma'],
  },
  {
    id: 4,
    title: 'Sistem Aplikasi Donasi Sosial Digital',
    company: 'Pt. Peduli',
    description: 'Memfasilitasi pengumpulan donasi secara digital',
    status: 'Approve',
    tech: ['Python'],
  },
];


export default function SubmitNewProject() {
  const navigate = useNavigate();

  const handleTambahProjekClick = () => {
    navigate('/partner/form-pengajuan-projek');
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      {/* Bagian Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Daftar Projek
        </h1>
      </div>

      {/* Bagian Kontrol */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Cari proyek..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          onClick={handleTambahProjekClick}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Tambahkan Projek
        </button>
      </div>

      {/* Bagian Daftar Proyek */}
      <div className="space-y-4">
        {mockProjects.length > 0 ? (
          mockProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="text-center flex justify-center items-center h-80 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-2xl text-gray-400">
              Belum Ada Projek Tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}