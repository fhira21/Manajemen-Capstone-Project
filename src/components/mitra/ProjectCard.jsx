import React from 'react';
import { useNavigate } from 'react-router-dom';

// Komponen untuk tag teknologi yang bisa dipakai ulang
const TechTag = ({ name }) => (
  <span className="bg-gray-200 text-gray-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
    {name}
  </span>
);

// Komponen untuk lencana status yang bisa dipakai ulang
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Review: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Approve: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  // Fungsi untuk menangani klik tombol "Lihat Detail"
  const handleLihatDetail = () => {
    // Arahkan ke halaman detail dengan ID proyek yang sesuai
    navigate(`/partner/detail-proyek/${project.id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 flex justify-between items-center">
      <div className="flex-grow">
        <div className="flex items-center mb-1">
          <h3 className="text-lg font-semibold text-gray-900 mr-3">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm text-gray-600 mb-1">{project.company}</p>
        <p className="text-sm text-gray-500 mb-3">{project.description}</p>
        <div>
          {project.tech.map((techName, index) => (
            <TechTag key={index} name={techName} />
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 ml-4">
        <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm mr-2">
          Edit
        </button>
        <button
          onClick={handleLihatDetail}
          className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600 transition text-sm"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}