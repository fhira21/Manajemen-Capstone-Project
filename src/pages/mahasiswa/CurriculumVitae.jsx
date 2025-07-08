import { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/buttonPrimary";
import cvData from "../../data/cv.json";
import mahasiswaData from "../../data/mahasiswa.json";
import { useAuth } from "../../context/AuthContext";

export default function CurriculumVitae() {
    const inputClasses = 'w-full border-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-secondary';
    const { user } = useAuth(); // Get user from AuthContext
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [hasCV, setHasCV] = useState(false);
    const [cvInfo, setCvInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    // Check if the user has a CV
    useEffect(() => {
        // Reset states when component mounts or user changes
        setCvInfo(null);
        setHasCV(false);
        
        // Load view preference from localStorage if available
        const savedView = localStorage.getItem('cvViewMode');
        
        // Get the user ID from the authentication context
        let userId = null;
        
        if (user && user.id) {
            userId = user.id; // Get user ID directly from auth context
        } else {
            // If not found in auth context, try from localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    userId = userData.id;
                } catch (error) {
                    console.error('Error parsing stored user data:', error);
                }
            }
        }
        
        if (userId) {
            // Find the user data in mahasiswa collection
            const mahasiswaUser = mahasiswaData.MAHASISWA.find(m => m.ID_User === userId);
            if (mahasiswaUser) {
                console.log('Found mahasiswa user:', mahasiswaUser);
                setUserInfo(mahasiswaUser);
                
                // Check if user has CV
                if (mahasiswaUser.ID_CV) {
                    const cv = cvData.CV_Mahasiswa.find(cv => cv.ID_CV === mahasiswaUser.ID_CV);
                    if (cv) {
                        console.log('Found CV for user:', cv);
                        setCvInfo(cv);
                        
                        // Set view mode based on localStorage or default to view if CV exists
                        if (savedView === 'edit') {
                            setHasCV(false);
                        } else {
                            setHasCV(true);
                        }
                    } else {
                        console.log('CV ID exists in user data but no matching CV found');
                        setHasCV(false);
                    }
                } else {
                    console.log('User has no CV ID');
                    setHasCV(false);
                }
            } else {
                console.log('User not found in mahasiswa data');
            }
        } else {
            // Fallback for development/testing purposes
            console.log('No user ID found, using default');
            const defaultUserId = "USR003";
            const defaultUser = mahasiswaData.MAHASISWA.find(m => m.ID_User === defaultUserId);
            if (defaultUser) {
                setUserInfo(defaultUser);
                if (defaultUser.ID_CV) {
                    const cv = cvData.CV_Mahasiswa.find(cv => cv.ID_CV === defaultUser.ID_CV);
                    if (cv) {
                        setCvInfo(cv);
                        if (savedView !== 'edit') {
                            setHasCV(true);
                        }
                    }
                }
            }
        }
    }, [user]); // Add user to dependency array

    const [additionalInfo, setAdditionalInfo] = useState({
        pengalaman_project: "",
        pengalaman_organisasi: "",
        pengalaman_pelatihan: "",
        bidang: "",
        keterampilan: ""
    });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdditionalInfo(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const handleSaveAdditionalInfo = () => {
        const newErrors = {...errors};
        let isValid = true;
        
        ['pengalaman_project', 'pengalaman_organisasi', 'pengalaman_pelatihan', 'bidang', 'keterampilan'].forEach(field => {
            if (!additionalInfo[field]) {
                newErrors[field] = 'Field ini wajib diisi';
                isValid = false;
            }
        });
        
        setErrors(newErrors);
        
        if (isValid) {
            console.log("Saving additional info:", additionalInfo);
            handleCloseModal();
            
            if (additionalInfo.bidang) {
                handleMultiInputChange('bidang', additionalInfo.bidang);
            }
            
            if (additionalInfo.keterampilan) {
                handleMultiInputChange('keterampilan', additionalInfo.keterampilan);
            }
            
            toast.success("Informasi tambahan berhasil disimpan", {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    const [formData, setFormData] = useState({
        nama: "",
        tanggal_lahir: "",
        gender: "",
        email: "",
        telepon: "",
        email_aktif: "",
        alamat: "",
        ringkasan: "",
        link_penghubung: "",
        bidang: [],
        keterampilan: []
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleMultiInputChange = (field, value) => {
        const items = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({
            ...prev,
            [field]: items
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        const requiredFields = [
            'nama', 'tanggal_lahir', 'gender', 'email', 
            'telepon', 'email_aktif', 'alamat', 'ringkasan' // ringkasan is the Ringkasan Profil field
        ];
        
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'Field ini wajib diisi';
            }
        });

        if (formData.bidang.length === 0) {
            newErrors.bidang = 'Bidang wajib diisi';
        }
        
        if (formData.keterampilan.length === 0) {
            newErrors.keterampilan = 'Keterampilan wajib diisi';
        }
        
        if (!additionalInfo.pengalaman_project) {
            newErrors.pengalaman_project = 'Pengalaman project wajib diisi';
        }
        
        if (!additionalInfo.pengalaman_organisasi) {
            newErrors.pengalaman_organisasi = 'Pengalaman organisasi wajib diisi';
        }
        
        if (!additionalInfo.pengalaman_pelatihan) {
            newErrors.pengalaman_pelatihan = 'Pengalaman pelatihan wajib diisi';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (formData.email_aktif && !emailRegex.test(formData.email_aktif)) {
            newErrors.email_aktif = 'Format email tidak valid';
        }
        
        const phoneRegex = /^[0-9+\-\s]+$/;
        if (formData.telepon && !phoneRegex.test(formData.telepon)) {
            newErrors.telepon = 'Nomor telepon hanya boleh berisi angka, +, -';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const isValid = validateForm();
        
        if (isValid) {
            const finalData = { 
                ...formData, 
                pengalaman_project: additionalInfo.pengalaman_project,
                pengalaman_organisasi: additionalInfo.pengalaman_organisasi,
                pengalaman_pelatihan: additionalInfo.pengalaman_pelatihan
            };
            console.log("CV Data to submit:", finalData);
            
            toast.success("Curriculum Vitae berhasil ditambahkan!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                    backgroundColor: "#4CAF50",
                    color: "white"
                }
            });
            
            setFormData({
                nama: "",
                tanggal_lahir: "",
                gender: "",
                email: "",
                telepon: "",
                email_aktif: "",
                alamat: "",
                ringkasan: "",
                link_penghubung: "",
                bidang: [],
                keterampilan: []
            });
            setAdditionalInfo({
                pengalaman_project: "",
                pengalaman_organisasi: "",
                pengalaman_pelatihan: "",
                bidang: "",
                keterampilan: ""
            });

            // In a real app, you would save the CV and update the user's CV ID
            
            // Generate a unique CV ID (in a real app, this would come from the backend)
            const newCvId = `CV${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            
            // Save the CV data with the authenticated user's information
            setHasCV(true);
            setCvInfo({
                ...finalData,
                ID_CV: newCvId,
                Link_Penghubung: finalData.link_penghubung,
                Ringkasan_Profil: finalData.ringkasan,
                Pengalaman_Project: finalData.pengalaman_project,
                Pengalaman_Organisasi: finalData.pengalaman_organisasi,
                Pengalaman_Pelatihan: finalData.pengalaman_pelatihan,
                Bidang: finalData.bidang.join(", "),
                Keterampilan: finalData.keterampilan.join(", ")
            });
            
            // Update user info with the new CV ID
            setUserInfo(prev => ({
                ...prev,
                ID_CV: newCvId,
                Nama: finalData.nama,
                Jenis_Kelamin: finalData.gender,
                No_Telepon: finalData.telepon,
                Alamat: finalData.alamat
            }));
            
            // In a real app, you would save this to the backend
            // For this demo, we'll store the CV ID in localStorage to persist between page refreshes
            if (user && user.id) {
                localStorage.setItem('userCV', newCvId);
            }
        } else {
            toast.error("Mohon lengkapi semua field yang wajib diisi", {
                position: "top-right",
                autoClose: 5000
            });
            
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // Function to check if user is authenticated and is a student
    const isAuthenticatedStudent = () => {
        if (!user) return false;
        
        const role = user.role || localStorage.getItem('userRole');
        return role === 'Mahasiswa';
    };
    
    // Handle case when user isn't properly authenticated
    useEffect(() => {
        if (userInfo === null && !isAuthenticatedStudent()) {
            toast.error("Anda tidak memiliki akses atau tidak terautentikasi sebagai mahasiswa", {
                position: "top-right",
                autoClose: 5000
            });
        }
    }, [userInfo]);

    // Check if user data is loading
    const isLoading = user === undefined;
    
    return (
        <div className="w-full flex flex-col justify-center items-start h-full overflow-y-auto">
            <PageTitle
                title="Curriculum Vitae"
                description="Manage your curriculum vitae data to improve your profile visibility."
            />

            {/* Toast Container positioned top-right */}
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastStyle={{
                    margin: "10px",
                    borderRadius: "4px",
                    boxShadow: "0 1px 10px 0 rgba(0, 0, 0, 0.1)",
                }}
            />
            
            {/* Show loading state if user data is still loading */}
            {isLoading ? (
                <div className="flex justify-center items-center w-full h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                </div>
            ) : (
                <>
                    {/* Navigation Tabs - Left aligned on large screens, centered on mobile */}
                    <div className="w-full flex justify-center md:justify-start mb-6 ">
                        <div className="grid grid-cols-2 gap-1 w-full max-w-md md:max-w-xs bg-transparent rounded-md shadow-sm" role="group">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setHasCV(false);
                                    localStorage.setItem('cvViewMode', 'edit');
                                }} 
                                className={`px-2 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all duration-200 
                                    ${!hasCV 
                                        ? 'bg-secondary text-white shadow-md' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} 
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50`}
                            >
                                <span className="flex justify-center items-center">
                                    {cvInfo ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            <span className="whitespace-normal text-center">Edit CV</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="whitespace-normal text-center">Tambah CV</span>
                                        </>
                                    )}
                                </span>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    // Only allow navigating to view CV if one exists
                                    if (cvInfo) {
                                        setHasCV(true);
                                        localStorage.setItem('cvViewMode', 'view');
                                    } else {
                                        // If no CV exists, show a toast notification
                                        toast.info("Anda belum memiliki CV. Silakan buat CV terlebih dahulu.", {
                                            position: "top-right",
                                            autoClose: 3000
                                        });
                                    }
                                }} 
                                className={`px-2 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all duration-200
                                    ${hasCV 
                                        ? 'bg-secondary text-white shadow-md' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50`}
                            >
                                <span className="flex justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="whitespace-normal text-center">Lihat CV</span>
                                </span>
                            </button>
                        </div>
                    </div>
            
            {/* Show CV data if it exists and user has chosen to view it, otherwise show form */}
            {hasCV && cvInfo ? (
                <div className="overflow-y-auto w-full border h-full p-5 gap-6 rounded-xl shadow flex flex-col justify-start items-start">
                    <h1 className="w-full text-2xl font-bold border-b pb-3">Curriculum Vitae</h1>
                    
                    {/* Main Info Section with Personal Info and Skills side by side */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Personal Info Section */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 text-primary">Informasi Pribadi</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Nama</p>
                                    <p className="text-base">{userInfo?.Nama || "Tidak Ada Data"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">NIM</p>
                                    <p className="text-base">{userInfo?.NIM || "Tidak Ada Data"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Jenis Kelamin</p>
                                    <p className="text-base">{userInfo?.Jenis_Kelamin || "Tidak Ada Data"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Nomor Telepon</p>
                                    <p className="text-base">{userInfo?.No_Telepon || "Tidak Ada Data"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Alamat</p>
                                    <p className="text-base">{userInfo?.Alamat || "Tidak Ada Data"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Link Penghubung</p>
                                    <a href={cvInfo.Link_Penghubung} target="_blank" rel="noopener noreferrer" 
                                    className="text-blue-500 hover:underline">
                                        {cvInfo.Link_Penghubung}
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Skills Section - Moved to right side */}
                        <div className="lg:col-span-1">
                            <h2 className="text-xl font-semibold mb-4 text-primary">Keterampilan</h2>
                            <div className="border p-4 rounded-lg bg-gray-50">
                                <p className="text-sm font-medium text-gray-500 mb-2">Bidang</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {cvInfo.Bidang.split(',').map((bidang, index) => (
                                        <span key={index} className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                                            {bidang.trim()}
                                        </span>
                                    ))}
                                </div>
                                
                                <p className="text-sm font-medium text-gray-500 mb-2">Keahlian</p>
                                <div className="flex flex-wrap gap-2">
                                    {cvInfo.Keterampilan.split(',').map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-secondary text-white rounded-full text-sm">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Profile Summary Section */}
                    <div className="w-full mt-6">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Ringkasan Profil</h2>
                        <div className="border p-4 rounded-lg bg-gray-50">
                            <p className="text-base">{cvInfo.Ringkasan_Profil || "Tidak Ada Data"}</p>
                        </div>
                    </div>
                    
                    {/* Experience Section */}
                    <div className="w-full mt-6">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Pengalaman</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pengalaman Project</p>
                                <p className="text-base mt-1 border p-3 rounded-lg bg-gray-50">{cvInfo.Pengalaman_Project}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pengalaman Organisasi</p>
                                <p className="text-base mt-1 border p-3 rounded-lg bg-gray-50">{cvInfo.Pengalaman_Organisasi}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pengalaman Pelatihan</p>
                                <p className="text-base mt-1 border p-3 rounded-lg bg-gray-50">{cvInfo.Pengalaman_Pelatihan}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Removed Edit Button as it's now in the tab navigation */}
                </div>
            ) : (
                /* Form to create CV */
                <div className="overflow-y-auto w-full border h-full p-5 gap-10 rounded-xl shadow flex flex-col justify-start items-center">
                <h1 className="w-full text-2xl font-bold">Menambahkan Curriculum Vitae (CV)</h1>

                <form onSubmit={handleSubmit}
                    className="w-full flex flex-col items-start justify-start"
                >
                    {/* Group 1: Nama, Tanggal Lahir, Gender */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="nama" className="block mb-1 font-medium text-sm">Nama <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                id="nama" 
                                className={`${inputClasses} h-9 text-sm ${errors.nama ? 'border-red-500' : ''}`} 
                                placeholder="Masukkan nama lengkap"
                                value={formData.nama}
                                onChange={handleChange} 
                            />
                            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                        </div>
                        <div>
                            <label htmlFor="tanggal_lahir" className="block mb-1 font-medium text-sm">Tanggal Lahir <span className="text-red-500">*</span></label>
                            <input 
                                type="date" 
                                id="tanggal_lahir" 
                                className={`${inputClasses} h-9 text-sm ${errors.tanggal_lahir ? 'border-red-500' : ''}`}
                                value={formData.tanggal_lahir}
                                onChange={handleChange}
                            />
                            {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir}</p>}
                        </div>
                        <div>
                            <label htmlFor="gender" className="block mb-1 font-medium text-sm">Gender <span className="text-red-500">*</span></label>
                            <select 
                                id="gender" 
                                className={`${inputClasses} h-9 text-sm ${errors.gender ? 'border-red-500' : ''}`}
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Pilih Gender</option>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                        </div>
                    </div>

                    {/* Group 2: Alamat Email, Nomor Telepon */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                            <label htmlFor="email" className="block mb-1 font-medium text-sm">Alamat Email <span className="text-red-500">*</span></label>
                            <input 
                                type="email" 
                                id="email" 
                                className={`${inputClasses} h-9 text-sm ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Masukkan alamat email"
                                value={formData.email}
                                onChange={handleChange} 
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="telepon" className="block mb-1 font-medium text-sm">Nomor Telepon <span className="text-red-500">*</span></label>
                            <input 
                                type="tel" 
                                id="telepon" 
                                className={`${inputClasses} h-9 text-sm ${errors.telepon ? 'border-red-500' : ''}`}
                                placeholder="Masukkan nomor telepon"
                                value={formData.telepon}
                                onChange={handleChange} 
                            />
                            {errors.telepon && <p className="text-red-500 text-xs mt-1">{errors.telepon}</p>}
                        </div>
                    </div>

                    {/* Group 3: Email Aktif, Alamat Domisili */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                            <label htmlFor="email_aktif" className="block mb-1 font-medium text-sm">Email Aktif <span className="text-red-500">*</span></label>
                            <input 
                                type="email" 
                                id="email_aktif" 
                                className={`${inputClasses} h-9 text-sm ${errors.email_aktif ? 'border-red-500' : ''}`}
                                placeholder="Masukkan email aktif"
                                value={formData.email_aktif}
                                onChange={handleChange} 
                            />
                            {errors.email_aktif && <p className="text-red-500 text-xs mt-1">{errors.email_aktif}</p>}
                        </div>
                        <div>
                            <label htmlFor="alamat" className="block mb-1 font-medium text-sm">Alamat Domisili <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                id="alamat" 
                                className={`${inputClasses} h-9 text-sm ${errors.alamat ? 'border-red-500' : ''}`}
                                placeholder="Masukkan alamat domisili"
                                value={formData.alamat}
                                onChange={handleChange} 
                            />
                            {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                        </div>
                    </div>

                    {/* Group 4: Link Penghubung */}
                    <div className="w-full mt-3">
                        <label htmlFor="link_penghubung" className="block mb-1 font-medium text-sm">Link Penghubung (LinkedIn, Portfolio, dll)</label>
                        <input 
                            type="text" 
                            id="link_penghubung" 
                            className={`${inputClasses} h-9 text-sm ${errors.link_penghubung ? 'border-red-500' : ''}`}
                            placeholder="Contoh: https://linkedin.com/in/username"
                            value={formData.link_penghubung}
                            onChange={handleChange} 
                        />
                        {errors.link_penghubung && <p className="text-red-500 text-xs mt-1">{errors.link_penghubung}</p>}
                    </div>

                    {/* Group 5: Ringkasan Profil */}
                    <div className="w-full mt-3">
                        <label htmlFor="ringkasan" className="block mb-1 font-medium text-sm">Ringkasan Profil <span className="text-red-500">*</span></label>
                        <textarea 
                            id="ringkasan" 
                            rows="3" 
                            className={`${inputClasses} h-full resize-none text-sm ${errors.ringkasan ? 'border-red-500' : ''}`}
                            placeholder="Tuliskan ringkasan profil anda"
                            value={formData.ringkasan}
                            onChange={handleChange}
                        ></textarea>
                        {errors.ringkasan && <p className="text-red-500 text-xs mt-1">{errors.ringkasan}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse md:flex-row justify-start w-full gap-4 mt-14">
                        <Button
                            className="text-black bg-gray-500 hover:bg-gray-600"  
                            onClick={handleOpenModal}
                            label="Hal Lain" 
                            type="button"
                            rightIcon={<img src="/assets/icons/icons8-add-100.png" alt="Add icon" className="w-4 h-4" />}
                        />

                        <Button
                            className="bg-secondary text-white"
                            onClick={handleSubmit} 
                            label="Simpan CV" 
                            type="submit"
                        />
                    </div>
                </form>
            </div>
            )}

            {/* Modal for "Hal Lain" button */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-20 flex items-center justify-center z-50" 
                    onClick={handleCloseModal}
                >
                    <div 
                        className="overflow-y-auto flex items-center justify-center" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="overflow-y-auto flex items-center justify-start w-max h-[90vh] p-5">
                            <div className="overflow-y-auto w-max h-full max-h-[80vh] p-5 rounded-lg bg-white flex flex-col items-center justify-start">
                                <div className="w-full flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Informasi Tambahan CV <span className="text-red-500">*</span></h2>
                                    <button 
                                        onClick={handleCloseModal}
                                        className="p-1 rounded-full hover:bg-gray-200 transition"
                                        aria-label="Close"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Modal Body */}
                                <div className="space-y-3 mt-2 w-full overflow-y-auto">
                                    <div>
                                        <label htmlFor="pengalaman_project" className="block font-medium text-sm">Pengalaman Project <span className="text-red-500">*</span></label>
                                        <textarea
                                            id="pengalaman_project"
                                            name="pengalaman_project"
                                            value={additionalInfo.pengalaman_project}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className={`${inputClasses} h-auto resize-none text-sm ${errors.pengalaman_project ? 'border-red-500' : ''}`}
                                            placeholder="Jelaskan pengalaman project yang pernah Anda kerjakan"
                                        ></textarea>
                                        {errors.pengalaman_project && <p className="text-red-500 text-xs mt-1">{errors.pengalaman_project}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="pengalaman_organisasi" className="block mb-1 font-medium text-sm">Pengalaman Organisasi <span className="text-red-500">*</span></label>
                                        <textarea
                                            id="pengalaman_organisasi"
                                            name="pengalaman_organisasi"
                                            value={additionalInfo.pengalaman_organisasi}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className={`${inputClasses} h-auto resize-none text-sm ${errors.pengalaman_organisasi ? 'border-red-500' : ''}`}
                                            placeholder="Jelaskan pengalaman organisasi Anda"
                                        ></textarea>
                                        {errors.pengalaman_organisasi && <p className="text-red-500 text-xs mt-1">{errors.pengalaman_organisasi}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="pengalaman_pelatihan" className="block mb-1 font-medium text-sm">Pengalaman Pelatihan <span className="text-red-500">*</span></label>
                                        <textarea
                                            id="pengalaman_pelatihan"
                                            name="pengalaman_pelatihan"
                                            value={additionalInfo.pengalaman_pelatihan}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className={`${inputClasses} h-auto resize-none text-sm ${errors.pengalaman_pelatihan ? 'border-red-500' : ''}`}
                                            placeholder="Jelaskan pengalaman pelatihan yang pernah Anda ikuti"
                                        ></textarea>
                                        {errors.pengalaman_pelatihan && <p className="text-red-500 text-xs mt-1">{errors.pengalaman_pelatihan}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="bidang" className="block mb-1 font-medium text-sm">
                                            Bidang <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(pisahkan dengan koma untuk beberapa bidang)</span>
                                        </label>
                                        <textarea
                                            id="bidang"
                                            name="bidang"
                                            value={additionalInfo.bidang}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className={`${inputClasses} h-auto resize-none text-sm ${errors.bidang ? 'border-red-500' : ''}`}
                                            placeholder="Contoh: Web Development, Mobile App Development, UI/UX Design"
                                        ></textarea>
                                        {errors.bidang && <p className="text-red-500 text-xs mt-1">{errors.bidang}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="keterampilan" className="block mb-1 font-medium text-sm">
                                            Keterampilan <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(pisahkan dengan koma untuk beberapa keterampilan)</span>
                                        </label>
                                        <textarea
                                            id="keterampilan"
                                            name="keterampilan"
                                            value={additionalInfo.keterampilan}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className={`${inputClasses} h-auto resize-none text-sm ${errors.keterampilan ? 'border-red-500' : ''}`}
                                            placeholder="Contoh: React, Node.js, MongoDB, Figma, JavaScript"
                                        ></textarea>
                                        {errors.keterampilan && <p className="text-red-500 text-xs mt-1">{errors.keterampilan}</p>}
                                    </div>
                                </div>
                            
                                {/* Modal Footer */}
                                <div className="flex w-full flex-col sm:flex-row gap-2 items-center mt-4">
                                    <Button
                                        className="bg-secondary w-full sm:w-1/2"
                                        onClick={handleSaveAdditionalInfo} 
                                        label="Simpan Informasi"
                                        type="button"
                                    />
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-1/2"
                                        onClick={handleCloseModal} 
                                        label="Batal"
                                        type="button"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </>
            )}
        </div>
    );
}
