import React from 'react';
import { useParams } from 'react-router-dom';

// Kita gunakan lagi mock data yang sama untuk menemukan proyek berdasarkan ID.
// Di aplikasi nyata, Anda akan melakukan fetch API ke server: /api/projects/${projectId}
const mockProjects = [
  { id: 1, title: 'Aplikasi Kasir UMKM', company: 'Pt. Maju Teknologi', description: 'Deskripsi untuk Aplikasi Kasir...', status: 'Review', tech: ['Firebase', 'React'], tujuan: [] },
  { id: 2, title: 'Desain UI Layanan Baca', company: 'Startup EduTech', description: 'Aplikasi ini dirancang sebagai platform membaca digital yang menyediakan pengalaman membaca yang nyaman, interaktif, dan personal. Halaman baca adalah inti dari aplikasi ini, dengan fokus pada antarmuka yang bersih, minim gangguan, dan mudah digunakan.', status: 'Review', tech: ['Python', 'Django'], tujuan: ['Meningkatkan efisiensi operasional melalui sistem aplikasi yang saling terintegrasi.', 'Mendukung transformasi digital, khususnya dalam perluasan pasar online.', 'Mengoptimalkan pengambilan keputusan melalui pemetaan nilai dan risiko dari tiap aplikasi.', 'Menentukan arah investasi TI secara objektif dan prioritas berdasarkan kebutuhan bisnis.'], komentar: { nama: 'Suryanto, M.Kom', tanggal: '17 jun', teks: 'Untuk Bahasanya kurang memungkinkan untuk kami gunakan pak' } },
  { id: 3, title: 'Sistem Sentimen Media Sosial', company: 'Pt. Datainsight', description: 'Deskripsi untuk Sistem Sentimen...', status: 'Pending', tech: ['Figma'], tujuan: [] },
  { id: 4, title: 'Sistem Aplikasi Donasi Sosial Digital', company: 'Pt. Peduli', description: 'Deskripsi untuk Aplikasi Donasi...', status: 'Approve', tech: ['Python'], tujuan: [] },
];

export default function DetailProyek() {
  // Ambil projectId dari URL, contoh: /detail-proyek/2 -> projectId akan bernilai "2"
  const { projectId } = useParams();

  // Cari proyek di dalam data berdasarkan ID. Ubah projectId menjadi angka dengan parseInt.
  const project = mockProjects.find(p => p.id === parseInt(projectId));

  // Jika proyek tidak ditemukan, tampilkan pesan.
  if (!project) {
    return <div className="p-8">Proyek tidak ditemukan.</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Detail Projek
      </h1>

      {/* Header Detail: Nama Proyek dan Status */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="w-1/3 border rounded-md p-2 text-gray-700">
          {project.title}
          {/* Anda bisa membuat ini menjadi dropdown sungguhan jika perlu */}
        </div>
        <div className="text-md font-semibold text-gray-600">
          Status: [{project.status}]
        </div>
      </div>

      {/* Konten Detail */}
      <div className="space-y-8">
        {/* Deskripsi */}
        <div>
          <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Deskripsi</h2>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>

        {/* Tujuan Strategis Proyek */}
        {project.tujuan && project.tujuan.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">Tujuan Strategis Proyek</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {project.tujuan.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Komentar */}
        {project.komentar && (
           <div>
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Komentar</h2>
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <p className="font-semibold text-gray-800 mr-2">{project.komentar.nama}</p>
                    <p className="text-sm text-gray-500">{project.komentar.tanggal}</p>
                  </div>
                  <p className="text-gray-700">{project.komentar.teks}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}