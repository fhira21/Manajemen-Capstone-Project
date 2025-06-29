import PageTitle from '../components/PageTitle';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const { user, isAuthenticated, loading, logout } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <>
        <PageTitle
            title="Management Capstone"
            description="Welcome to the Management Capstone project. This is a platform designed to help you manage your projects effectively."
        />
        <div className="flex p-2 flex-col items-center text-center gap-2 justify-center h-screen bg-primary text-white">
            <h1 className="text-4xl font-black">Welcome to Management Capstone </h1>
            <h2 className="text-2xl w-[80%] font-semibold">Welcome to the Management Capstone project. This is a platform designed to help you manage your projects effectively.</h2>
            
            {isAuthenticated && user && (
                <div className="mb-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <p className="text-lg">Welcome back, <span className="font-bold">{user.name || user.username}</span>!</p>
                    <p className="text-sm opacity-80">Role: {user.role}</p>
                </div>
            )}
            
            <div className="flex items-center gap-2 justify-content-center">
                {isAuthenticated && user ? (
                    <div className="flex gap-2">
                        <NavLink 
                            to={
                                user.role?.toLowerCase() === 'dosen' ? '/lecturer/dashboard' :
                                user.role?.toLowerCase() === 'mahasiswa' ? '/student/dashboard' :
                                user.role?.toLowerCase() === 'mitra' ? '/partner/dashboard' :
                                `/${user.role?.toLowerCase()}/dashboard`
                            } 
                            className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition-colors"
                        >
                            Go to Dashboard
                        </NavLink>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <NavLink to="/login" className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition-colors">
                            Login
                        </NavLink>
                        <NavLink to="/register" className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition-colors">
                            Register
                        </NavLink>
                    </>
                )}
            </div>
        </div>
        </>
    );
}