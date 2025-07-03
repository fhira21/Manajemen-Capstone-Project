import { Routes, Route } from 'react-router-dom'; // Keep these imports
// import { BrowserRouter as Router } or similar should be REMOVED

import { AuthProvider} from './context/AuthContext';
import {ProtectedRoute} from './context/ProtectedRoute';
import { AuthRoute } from './context/ProtectedRoute';
import Login from './pages/login';
import Register from './pages/register';
import Main from './pages/main';
import DashboardDosen from './pages/dosen/dashboardLecturer';
import DashboardMitra from './pages/mitra/dashboardPartner';
import Unauthorized from './pages/Unauthorized';



// Halaman umum
import Settings from './pages/setting';


// Halaman mahasiswa
import LandingPage from './pages/LandingPage';
import DashboardStudent from './pages/mahasiswa/DashboardStudent';
import AddCurriculumVitae from './pages/mahasiswa/AddCurriculumVitae';
import ProjectSelection from './pages/mahasiswa/ProjectSelection';

// Halaman dosen
import ProposalPartner from './pages/dosen/ProposalPartner';
import StudentData from './pages/dosen/StudentData';
import ListStudentRegister from './pages/ListStudentRegister';
import ProgresProject from './pages/dosen/ProgresProject';

// Halaman mitra
import SubmitNewProject from './pages/mitra/SubmitNewProject';

export default function App() {
  return (
    <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Auth routes (only accessible when not logged in) */}
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/register" element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } />

          {/* Student routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['Mahasiswa']}>
              <Main role="Mahasiswa" />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardStudent />} />
            <Route path="dashboard" element={<DashboardStudent />} />
            <Route path="add-curriculum-vitae" element={<AddCurriculumVitae />} />
            <Route path="project-selection" element={<ProjectSelection />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Lecturer routes */}
          <Route path="/lecturer" element={
            <ProtectedRoute allowedRoles={['Dosen']}>
              <Main role="Dosen" />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardDosen />} />
            <Route path="dashboard" element={<DashboardDosen />} />
            <Route path="proposal-partner" element={<ProposalPartner />} />
            <Route path="student-data" element={<StudentData />} />
            <Route path="student-list-register" element={<ListStudentRegister />} />
            <Route path="progres-project" element={<ProgresProject />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Partner routes */}
          <Route path="/partner" element={
            <ProtectedRoute allowedRoles={['Mitra']}>
              <Main role="Mitra" />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardMitra />} />
            <Route path="dashboard" element={<DashboardMitra />} />
            <Route path="submit-new-project" element={<SubmitNewProject />} />
            <Route path="student-list-register" element={<ListStudentRegister />} />
            <Route path="project-selection" element={<ProjectSelection />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1 className="text-center text-3xl mt-10">404 Not Found</h1>} />
        </Routes>
    </AuthProvider>
  );
}