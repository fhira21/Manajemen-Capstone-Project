import PageTitle from '../components/PageTitle';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LandingPage() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role) {
            setUserRole(role);
        }
    }, []);

    return (
        <>
        <PageTitle
            title="Management Capstone"
            description="Welcome to the Management Capstone project. This is a platform designed to help you manage your projects effectively."
        />
        <div className="flex p-2 flex-col items-center text-center gap-2 justify-center h-screen bg-primary text-white">
            <h1 className="text-4xl font-black">Welcome to Management Capstone </h1>
            <h2 className="text-2xl w-[80%] font-semibold">Welcome to the Management Capstone project. This is a platform designed to help you manage your projects effectively.</h2>
            <div className="flex items-center gap-2 justify-content-center">
                {userRole ? (
                    <NavLink 
                        to={
                            userRole.toLowerCase() === 'dosen' ? '/lecturer/dashboard' :
                            userRole.toLowerCase() === 'mahasiswa' ? '/student/dashboard' :
                            userRole.toLowerCase() === 'mitra' ? '/partner/dashboard' :
                            `/${userRole.toLowerCase()}/dashboard`
                        } 
                        className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition-colors"
                    >
                        Go to Dashboard
                    </NavLink>
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