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

// Halaman mahasiswa
import LandingPage from './pages/LandingPage';
import DashboardStudent from './pages/mahasiswa/dasboardStudent';
import AddCurriculumVitae from './pages/mahasiswa/AddCurriculumVitae';
import StudentPortofolio from './pages/mahasiswa/StudentPortofolio';
import ProjectSelection from './pages/mahasiswa/ProjectSelection';
import ManageAccountStudent from './pages/mahasiswa/ManageAccountStudent';
import SettingStudent from './pages/mahasiswa/SettingStudent';

// Halaman dosen
import ProposalPartner from './pages/dosen/ProposalPartner';
import StudentData from './pages/dosen/StudentData';
import ListStudentRegister from './pages/ListStudentRegister';
import ProgresProject from './pages/dosen/ProgresProject';
import ManageAccountLecturer from './pages/dosen/ManageAccountLecturer';
import SettingLecturer from './pages/dosen/SettingLecturer';

// Halaman mitra
import SubmitNewProject from './pages/mitra/SubmitNewProject';
import ManageAccountStudentPartner from './pages/mitra/ManageAccountStudentPartner';
import SettingPartner from './pages/mitra/SettingPartner';

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
            <Route path="student-portofolio" element={<StudentPortofolio />} />
            <Route path="project-selection" element={<ProjectSelection />} />
            <Route path="manage-account-student" element={<ManageAccountStudent />} />
            <Route path="setting" element={<SettingStudent />} />
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
            <Route path="manage-account-lecturer" element={<ManageAccountLecturer />} />
            <Route path="setting" element={<SettingLecturer />} />
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
            <Route path="manage-account-partner" element={<ManageAccountStudentPartner />} />
            <Route path="setting" element={<SettingPartner />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1 className="text-center text-3xl mt-10">404 Not Found</h1>} />
        </Routes>
    </AuthProvider>
  );
}