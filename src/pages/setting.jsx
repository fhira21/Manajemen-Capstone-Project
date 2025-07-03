import { useState, useEffect } from 'react';


import PageTitle from '../components/PageTitle';


export default function Settings() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Get user role from localStorage
        const role = localStorage.getItem('userRole');
        if (role) {
            setUserRole(role);
        }
    }, []);

    const renderContent = () => {
        switch(userRole) {
            case 'Mahasiswa':
                return <p className="text-lg text-blue-600">Settings untuk Mahasiswa</p>;
            case 'Dosen':
                return <p className="text-lg text-orange-400">Settings untuk Dosen</p>;
            case 'Mitra':
                return <p className="text-lg text-purple-600">Settings untuk Mitra</p>;
            default:
                return <p className="text-lg text-gray-600">Role tidak ditemukan</p>;
        }
    };

    return (
        <>
            <PageTitle
                title="Settings"
                description="Pengaturan untuk pengguna"
            />
            <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>
                    {renderContent()}
                </div>
            </div>
        </>
    );
}