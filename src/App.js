// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';


import Main from './pages/main';

// halaman 
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/dasboard';
import AddCurriculumVitae from './pages/AddCurriculumVitae';
import ProjectSubmission from './pages/ProjectSubmission';
import ProjectSelection from './pages/ProjectSelection';
import ManageAccount from './pages/ManageAccount';

import Settings from './pages/settings';



export default function App() {
  return (
    <Router>
      <Routes>

        {/* Halaman tanpa sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Halaman tanpa sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* Semua halaman yang memiliki sidebar dibungkus oleh Main */}
        <Route path="/app" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-curriculum-vitae" element={<AddCurriculumVitae/>} />
          <Route path="project-submission" element={<ProjectSubmission />} />
          <Route path="project-selection" element={<ProjectSelection />} />
          <Route path="manage-account" element={<ManageAccount />} />
          <Route path="setting" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1 className="text-center text-3xl mt-10">404 Not Found</h1>} />

      </Routes>
    </Router>
  );
}
