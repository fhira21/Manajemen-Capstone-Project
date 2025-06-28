import { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { getCVMahasiswa } from "../../data/localStorage";
import { useAuth } from "../../context/AuthContext";

export default function StudentPortofolio() {
    const { user } = useAuth();
    const [cvData, setCvData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCVData = () => {
            try {
                const allCVs = getCVMahasiswa();
                // Filter CVs for current user
                const userCVs = allCVs.filter(cv => 
                    cv.ID_User === user?.id || cv.ID_User === user?.ID_User
                );
                setCvData(userCVs);
            } catch (error) {
                console.error('Error loading CV data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCVData();
    }, [user]);

    if (loading) {
        return (
            <>
                <PageTitle
                    title="Portfolio Saya"
                    description="Lihat dan kelola curriculum vitae yang telah Anda buat."
                />
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Memuat data...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageTitle
                title="Portfolio Saya"
                description="Lihat dan kelola curriculum vitae yang telah Anda buat."
            />
            <div className="container mx-auto px-4 py-6">
                {cvData.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">
                            Belum ada CV yang dibuat
                        </div>
                        <p className="text-gray-400">
                            Silakan buat CV baru di menu "Add Curriculum Vitae"
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {cvData.map((cv, index) => (
                            <div key={cv.ID_CV} className="bg-white rounded-lg shadow-md p-6 border">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        CV #{index + 1} - {cv.Nama}
                                    </h3>
                                    <span className="text-sm text-gray-500">ID: {cv.ID_CV}</span>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Informasi Personal</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><span className="font-medium">Email:</span> {cv.Email}</p>
                                            <p><span className="font-medium">Telepon:</span> {cv.Telepon}</p>
                                            <p><span className="font-medium">Tanggal Lahir:</span> {cv.Tanggal_Lahir}</p>
                                            <p><span className="font-medium">Gender:</span> {cv.Gender}</p>
                                            <p><span className="font-medium">Alamat:</span> {cv.Alamat}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Keahlian & Bidang</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><span className="font-medium">Bidang:</span> {cv.Bidang}</p>
                                            <p><span className="font-medium">Keterampilan:</span> {cv.Keterampilan}</p>
                                            {cv.Link_Penghubung && (
                                                <p><span className="font-medium">Link:</span> 
                                                    <a href={cv.Link_Penghubung} target="_blank" rel="noopener noreferrer" 
                                                       className="text-blue-600 hover:text-blue-800 ml-1">
                                                        {cv.Link_Penghubung}
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Ringkasan</h4>
                                    <p className="text-sm text-gray-600">{cv.Ringkasan}</p>
                                </div>

                                <div className="mt-4 grid md:grid-cols-3 gap-4">
                                    <div>
                                        <h5 className="font-medium text-gray-700 mb-1">Pengalaman Project</h5>
                                        <p className="text-sm text-gray-600">{cv.Pengalaman_Project}</p>
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-gray-700 mb-1">Pengalaman Organisasi</h5>
                                        <p className="text-sm text-gray-600">{cv.Pengalaman_Organisasi}</p>
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-gray-700 mb-1">Pengalaman Pelatihan</h5>
                                        <p className="text-sm text-gray-600">{cv.Pengalaman_Pelatihan}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}