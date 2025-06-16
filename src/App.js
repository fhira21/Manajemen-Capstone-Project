import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Main from './pages/main';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={<Main/>}/>
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Add a catch-all route for 404 page */}
        <Route path="*" element={<h1 className="text-3xl font-bold text-center my-10">Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}