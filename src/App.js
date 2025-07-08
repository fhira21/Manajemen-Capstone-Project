import React, { useState } from 'react'; // 1. Impor 'useState' dari React

import { Routes, Route } from 'react-router-dom';



import { AuthProvider} from './context/AuthContext';

import { ProtectedRoute } from './context/ProtectedRoute';

import { AuthRoute } from './context/ProtectedRoute';

import Login from './pages/login';

import Register from './pages/register';

import Main from './pages/main';

import Unauthorized from './pages/Unauthorized';

// Public Pages
import ProjectDetail from './pages/ProjectDetail';



// Halaman umum

import Settings from './pages/setting';



// Halaman mahasiswa

import LandingPage from './pages/LandingPage';

import Dashboard from './pages/Dashboard';

import CurriculumVitae from './pages/mahasiswa/CurriculumVitae';

import ProjectSelection from './pages/mahasiswa/ProjectSelection';



// Halaman dosen

import ProposalPartner from './pages/dosen/ProposalPartner';

import StudentData from './pages/dosen/StudentData';

import StudentListRegister from './pages/dosen/ListStudentRegister';
import ProgresProject from './pages/dosen/ProgresProject';



// Halaman mitra

import SubmitNewProject from './pages/mitra/SubmitNewProject';
import FormPengajuanProjek from './pages/mitra/FormPengajuanProjek';
import DetailProyek from './pages/mitra/DetailProyek';

// Data awal bisa diletakkan di luar jika tidak akan berubah
const initialProjects = [
    { id: 1, title: 'Aplikasi Kasir UMKM', company: 'Pt. Maju Teknologi', description: 'Pengembangan aplikasi kasir untuk usaha UMKM kecil', status: 'Review', tech: ['Firebase', 'React'], tujuan: [] },
    { id: 2, title: 'Desain UI Layanan Baca', company: 'Startup EduTech', description: 'Aplikasi ini dirancang sebagai platform membaca digital...', status: 'Review', tech: ['Python', 'Django'], tujuan: ['Meningkatkan efisiensi...'], komentar: { nama: 'Suryanto, M.Kom', tanggal: '17 jun', teks: 'Untuk Bahasanya kurang memungkinkan untuk kami gunakan pak' } },
];

export default function App() {
  // 2. Pindahkan state dan fungsi ke dalam komponen App
  const [projects, setProjects] = useState(initialProjects);

  const addProject = (newProject) => {
    setProjects(currentProjects => [
      ...currentProjects,
      { 
        ...newProject, 
        id: Date.now(),
        status: 'Review'
      }
    ]);
  };

return (

<AuthProvider>

<Routes>

{/* Public routes */}

<Route path="/" element={<LandingPage />} />

<Route path="/unauthorized" element={<Unauthorized />} />


{/* Auth routes (only accessible when not logged in) */}

<Route path="/login" element={ <AuthRoute> <Login /> </AuthRoute> } />

<Route path="/register" element={ <AuthRoute> <Register /> </AuthRoute> } />



{/* Student routes */}

<Route path="/student" element={ <ProtectedRoute allowedRoles={['Mahasiswa']}> <Main role="Mahasiswa" /> </ProtectedRoute> }>

<Route index element={<Dashboard />} />

<Route path="dashboard" element={<Dashboard />} />

<Route path="curriculum-vitae" element={<CurriculumVitae />} />

<Route path="project-selection" element={<ProjectSelection />} />

<Route path="settings" element={<Settings />} />


<Route path="project-detail/:id" element={<ProjectDetail />} />


</Route>



{/* Lecturer routes */}

<Route path="/lecturer" element={ <ProtectedRoute allowedRoles={['Dosen']}> <Main role="Dosen" /> </ProtectedRoute> }>

<Route index element={<Dashboard />} />

<Route path="dashboard" element={<Dashboard />} />

<Route path="proposal-partner" element={<ProposalPartner />} />

<Route path="student-data" element={<StudentData />} />

<Route path="progres-project" element={<ProgresProject />} />

<Route path="student-list-register" element={<StudentListRegister />} />

<Route path="settings" element={<Settings />} />

</Route>



{/* Partner routes Mitra */}

<Route path="/partner" element={ <ProtectedRoute allowedRoles={['Mitra']}> <Main role="Mitra" /> </ProtectedRoute> }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="form-pengajuan-projek" element={<FormPengajuanProjek onAddProject={addProject} />} />
            <Route path="detail-proyek/:projectId" element={<DetailProyek projects={projects} />} /> {/* For legacy support */}
            <Route path="project-detail/:id" element={<ProjectDetail />} /> {/* New project detail route */}
            <Route path="project-selection" element={<ProjectSelection />} />
            <Route path="settings" element={<Settings />} />
          </Route>



{/* 404 */}

<Route path="*" element={<h1 className="text-center text-3xl mt-10">404 Not Found</h1>} />

</Routes>

</AuthProvider>

);

}