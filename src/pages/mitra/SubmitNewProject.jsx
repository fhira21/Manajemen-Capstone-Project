import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../../components/mitra/ProjectCard';

// 1. Terima 'projects' sebagai prop dari App.js
export default function SubmitNewProject({ projects }) {
  const navigate = useNavigate();

  // 2. HAPUS 'const mockProjects = [...]' DARI FILE INI.
  // Data sekarang dikelola oleh App.js.

  const handleTambahProjekClick = () => {
    navigate('/partner/form-pengajuan-projek');
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Daftar Projek
        </h1>
      </div>

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

      <div className="space-y-4">
        {/* 3. Gunakan 'projects' dari prop, BUKAN 'mockProjects' */}
        {projects && projects.length > 0 ? (
          projects.map(project => (
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