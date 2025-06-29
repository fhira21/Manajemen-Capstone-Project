import { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { getCVMahasiswa, getMahasiswa, updateCVMahasiswa, addCVMahasiswa } from "../../data/localStorage";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/buttonPrimary";

export default function CVPortofolio() {
    const { user } = useAuth();
    const [cvData, setCvData] = useState([]);
    const [MahasiswaData,setMahasiswaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCV, setEditingCV] = useState(null);
    const [formData, setFormData] = useState({
        Nama: '',
        Email: '',
        Telepon: '',
        Tanggal_Lahir: '',
        Gender: '',
        Alamat: '',
        Bidang: '',
        Keterampilan: '',
        Link_Penghubung: '',
        Ringkasan: '',
        Pengalaman_Project: '',
        Pengalaman_Organisasi: '',
        Pengalaman_Pelatihan: ''
    });

    // Add CV form data for when no CVs exist
    const [newCVFormData, setNewCVFormData] = useState({
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [additionalInfo, setAdditionalInfo] = useState({
        pengalaman_project: "",
        pengalaman_organisasi: "",
        pengalaman_pelatihan: "",
        bidang: "",
        keterampilan: ""
    });

    const inputClasses = 'w-full border-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

    useEffect(() => {
        const loadData = () => {
            try {
                // Load CV data - ensure we're using the correct user ID property
                const allCVs = getCVMahasiswa();
                
                // Use consistent ID property matching main.jsx
                const userId = user?.ID_User || user?.id;
                
                const userCVs = allCVs.filter(cv => cv.ID_User === userId);
                setCvData(userCVs);

                // Load MAHASISWA data for profile photo - use consistent ID property
                const allMahasiswa = getMahasiswa();
                
                const userMahasiswa = allMahasiswa.find(mhs => mhs.ID_User === userId);
                setMahasiswaData(userMahasiswa);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [user]);

    // CRUD Functions - UPDATE only for existing CVs, CREATE for new CVs
    const handleEdit = (cv) => {
        setEditingCV(cv);
        setFormData(cv);
        setShowModal(true);
    };



    const handleUpdate = () => {
        if (!editingCV) return;
        
        try {
            updateCVMahasiswa(editingCV.ID_CV, formData);
            setCvData(prev => prev.map(cv => 
                cv.ID_CV === editingCV.ID_CV ? { ...cv, ...formData } : cv
            ));
            setShowModal(false);
            toast.success('CV berhasil diperbarui');
        } catch (error) {
            console.error('Error updating CV:', error);
            toast.error('Gagal memperbarui CV');
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Functions for creating new CV (from AddCurriculumVitae)
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleNewCVInputChange = (e) => {
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
            handleCloseModal();
            
            if (additionalInfo.bidang) {
                handleMultiInputChange('bidang', additionalInfo.bidang);
            }
            
            if (additionalInfo.keterampilan) {
                handleMultiInputChange('keterampilan', additionalInfo.keterampilan);
            }
            
            toast.success("Informasi tambahan berhasil disimpan");
        }
    };

    const handleNewCVChange = (e) => {
        const { id, value } = e.target;
        setNewCVFormData(prev => ({
            ...prev,
            [id]: value
        }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleMultiInputChange = (field, value) => {
        const items = value.split(',').map(item => item.trim()).filter(item => item);
        setNewCVFormData(prev => ({
            ...prev,
            [field]: items
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateNewCVForm = () => {
        const newErrors = {};
        
        const requiredFields = [
            'nama', 'tanggal_lahir', 'gender', 'email', 
            'telepon', 'email_aktif', 'alamat', 'ringkasan'
        ];
        
        requiredFields.forEach(field => {
            if (!newCVFormData[field]) {
                newErrors[field] = 'Field ini wajib diisi';
            }
        });

        if (newCVFormData.bidang.length === 0) {
            newErrors.bidang = 'Bidang wajib diisi';
        }
        
        if (newCVFormData.keterampilan.length === 0) {
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
        if (newCVFormData.email && !emailRegex.test(newCVFormData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (newCVFormData.email_aktif && !emailRegex.test(newCVFormData.email_aktif)) {
            newErrors.email_aktif = 'Format email tidak valid';
        }
        
        const phoneRegex = /^[0-9+\-\s]+$/;
        if (newCVFormData.telepon && !phoneRegex.test(newCVFormData.telepon)) {
            newErrors.telepon = 'Nomor telepon hanya boleh berisi angka, +, -';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Generate unique CV ID
    const generateCVId = () => {
        const existingCVs = getCVMahasiswa();
        const existingIds = existingCVs.map(cv => cv.ID_CV);
        let newId;
        let counter = 1;
        
        do {
            newId = `CV${counter.toString().padStart(3, '0')}`;
            counter++;
        } while (existingIds.includes(newId));
        
        return newId;
    };

    const handleSubmitNewCV = (e) => {
        e.preventDefault();
        
        const isValid = validateNewCVForm();
        
        if (isValid) {
            // Create CV data matching the expected structure
            const cvData = {
                ID_CV: generateCVId(),
                ID_User: user?.id || user?.ID_User || '',
                Nama: newCVFormData.nama,
                Tanggal_Lahir: newCVFormData.tanggal_lahir,
                Gender: newCVFormData.gender,
                Email: newCVFormData.email,
                Telepon: newCVFormData.telepon,
                Email_Aktif: newCVFormData.email_aktif,
                Alamat: newCVFormData.alamat,
                Ringkasan: newCVFormData.ringkasan,
                Link_Penghubung: newCVFormData.link_penghubung,
                Pengalaman_Project: additionalInfo.pengalaman_project,
                Pengalaman_Organisasi: additionalInfo.pengalaman_organisasi,
                Pengalaman_Pelatihan: additionalInfo.pengalaman_pelatihan,
                Bidang: Array.isArray(newCVFormData.bidang) ? newCVFormData.bidang.join(', ') : newCVFormData.bidang,
                Keterampilan: Array.isArray(newCVFormData.keterampilan) ? newCVFormData.keterampilan.join(', ') : newCVFormData.keterampilan
            };
            
            // Save to localStorage
            const success = addCVMahasiswa(cvData);
            
            if (success) {
                toast.success("Curriculum Vitae berhasil ditambahkan!");
                
                // Reset form and reload data
                setNewCVFormData({
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
                
                // Reload CV data
                const allCVs = getCVMahasiswa();
                const userCVs = allCVs.filter(cv => 
                    cv.ID_User === user?.id || cv.ID_User === user?.ID_User
                );
                setCvData(userCVs);
            } else {
                toast.error("Terjadi kesalahan saat menyimpan CV. Silakan coba lagi.");
            }
        } else {
            toast.error("Mohon lengkapi semua field yang wajib diisi");
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col">
                <PageTitle
                    title="Portfolio Saya"
                    description="Lihat dan kelola curriculum vitae yang telah Anda buat."
                />
                <div className="flex-1 flex justify-center items-center">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="text-gray-500 text-lg">Memuat data...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-y-auto h-full flex flex-col overflow-hidden">
            {/* Toast Container */}
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
            />

            <PageTitle
                title="Portfolio Saya"
                description="Lihat dan kelola curriculum vitae yang telah Anda buat."
            />

            {cvData.length === 0 ? (
                // Show Add CV Form when no CVs exist
                <div className="w-full h-full p-5 gap-6  flex flex-col justify-start items-center">
                    <h1 className="w-full text-2xl font-bold">Menambahkan Curriculum Vitae (CV)</h1>
                    <form onSubmit={handleSubmitNewCV}
                        className="w-full h-full  flex flex-col items-start justify-start">
                        {/* Group 1: Nama, Tanggal Lahir, Gender */}
                        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="nama" className="block mb-1 font-medium text-sm">Nama <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    id="nama" 
                                    className={`${inputClasses} h-9 text-sm ${errors.nama ? 'border-red-500' : ''}`} 
                                    placeholder="Masukkan nama lengkap"
                                    value={newCVFormData.nama}
                                    onChange={handleNewCVChange}
                                />
                                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                            </div>
                            <div>
                                <label htmlFor="tanggal_lahir" className="block mb-1 font-medium text-sm">Tanggal Lahir <span className="text-red-500">*</span></label>
                                <input 
                                    type="date" 
                                    id="tanggal_lahir" 
                                    className={`${inputClasses} h-9 text-sm ${errors.tanggal_lahir ? 'border-red-500' : ''}`}
                                    value={newCVFormData.tanggal_lahir}
                                    onChange={handleNewCVChange}
                                />
                                {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir}</p>}
                            </div>
                            <div>
                                <label htmlFor="gender" className="block mb-1 font-medium text-sm">Gender <span className="text-red-500">*</span></label>
                                <select 
                                    id="gender" 
                                    className={`${inputClasses} h-9 text-sm ${errors.gender ? 'border-red-500' : ''}`}
                                    value={newCVFormData.gender}
                                    onChange={handleNewCVChange}
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
                                    value={newCVFormData.email}
                                    onChange={handleNewCVChange}
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
                                    value={newCVFormData.telepon}
                                    onChange={handleNewCVChange}
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
                                    value={newCVFormData.email_aktif}
                                    onChange={handleNewCVChange}
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
                                    value={newCVFormData.alamat}
                                    onChange={handleNewCVChange}
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
                                value={newCVFormData.link_penghubung}
                                onChange={handleNewCVChange}
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
                                value={newCVFormData.ringkasan}
                                onChange={handleNewCVChange}
                            ></textarea>
                            {errors.ringkasan && <p className="text-red-500 text-xs mt-1">{errors.ringkasan}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse md:flex-row justify-start w-full md:w-[60%] gap-4 mt-10">
                            <Button
                                className="bg-gray-300 hover:bg-gray-600"  
                                onClick={handleOpenModal}
                                label="Hal Lain" 
                                type="button"
                                rightIcon={<img src="/assets/icons/icons8-add-100.png" alt="Add icon" className="w-4 h-4" />}
                            />

                            <Button
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleSubmitNewCV} 
                                label="Simpan CV" 
                                type="submit"
                            />
                        </div>
                    </form>

                    {/* Modal for "Hal Lain" button */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-20 flex items-center justify-center z-50" 
                            onClick={handleCloseModal}
                        >
                            <div 
                                className="bg-white rounded-lg p-4 w-full max-w-2xl shadow-xl" 
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Informasi Tambahan CV <span className="text-red-500">*</span></h2>
                                    <button 
                                        onClick={handleCloseModal}
                                        className="p-1 rounded-full hover:bg-gray-200 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Modal Body */}
                                <div className="space-y-3 mt-2">
                                    <div>
                                        <label htmlFor="pengalaman_project" className="block font-medium text-sm">Pengalaman Project <span className="text-red-500">*</span></label>
                                        <textarea
                                            id="pengalaman_project"
                                            name="pengalaman_project"
                                            value={additionalInfo.pengalaman_project}
                                            onChange={handleNewCVInputChange}
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
                                            onChange={handleNewCVInputChange}
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
                                            onChange={handleNewCVInputChange}
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
                                            onChange={handleNewCVInputChange}
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
                                            onChange={handleNewCVInputChange}
                                            rows="2"
                                            className={`${inputClasses} h-auto resize-none text-sm ${errors.keterampilan ? 'border-red-500' : ''}`}
                                            placeholder="Contoh: React, Node.js, MongoDB, Figma, JavaScript"
                                        ></textarea>
                                        {errors.keterampilan && <p className="text-red-500 text-xs mt-1">{errors.keterampilan}</p>}
                                    </div>
                                </div>
                            
                                {/* Modal Footer */}
                                <div className="flex flex-col gap-2 items-center mt-4">
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 w-full"
                                        onClick={handleSaveAdditionalInfo} 
                                        label="Simpan Informasi"
                                        type="button"
                                    />
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white w-full"
                                        onClick={handleCloseModal} 
                                        label="Batal"
                                        type="button"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Show CV List when CVs exist
                <div className=" flex flex-col p-2 items-center justify-start">
                    {cvData.map((cv, index) => (
                            <div key={cv.ID_CV} className=" w-full flex flex-col items-center justify-start gap-5  ">
                                <div className="w-full border-b pb-2">
                                    <div className="flex justify-between items-center">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-xl font-bold mb-2 truncate">
                                                CV #{index + 1} - {cv.Nama}
                                            </h3>
                                            <div className="flex items-center">
                                                <span className=" bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    ID: {cv.ID_CV}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <button 
                                                onClick={() => handleEdit(cv)}
                                                className="bg-secondary hover:bg-secondary/80  backdrop-blur-sm p-3 rounded-xl transition-all duration-200 flex items-center space-x-2"
                                                title="Edit CV"
                                            >
                                                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <span className=" text-white text-sm font-medium hidden sm:block">Edit</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                    {/* Summary */}
                                    <div className="w-full border-gray-200">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-gray-800 text-lg">Ringkasan Profil</h4>
                                        </div>
                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                                            <p className="text-gray-700 text-sm leading-relaxed">{cv.Ringkasan}</p>
                                        </div>
                                    </div>
                                    

                                {/* CV Content */}
                                <div className="w-full flex flex-col items-start justify-start gap-5">
                                    <div className="w-full grid lg:grid-cols-2 gap-6">
                                        {/* Personal Information */}
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-lg">Informasi Personal</h4>
                                            </div>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium truncate">{cv.Email}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium">{cv.Telepon}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium">{cv.Tanggal_Lahir}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium truncate">{cv.Alamat}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-700 font-medium capitalize">{cv.Gender}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        

                                        {/* Skills & Field */}
                                        <div className="">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-lg">Keahlian & Bidang</h4>
                                            </div>
                                            <div className="space-y-4 text-sm">
                                                <div className="p-4 bg-blue-50 rounded-lg">
                                                    <span className="text-gray-600 font-semibold text-sm">Bidang Keahlian:</span>
                                                    <div className="mt-2">
                                                        <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                                                            {cv.Bidang}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className=" bg-green-50 p-3 rounded-lg">
                                                    <span className="text-gray-600 font-semibold text-sm">Keterampilan:</span>
                                                    <p className="text-gray-800 mt-2 text-sm leading-relaxed">{cv.Keterampilan}</p>
                                                </div>
                                                {cv.Link_Penghubung && (
                                                    <div className="p-4 bg-purple-50 rounded-lg">
                                                        <span className="text-gray-600 font-semibold text-sm">Link penghubung:</span>
                                                        <a href={cv.Link_Penghubung} target="_blank" rel="noopener noreferrer" 
                                                           className="block text-purple-600 hover:text-purple-800 mt-2 break-all text-sm font-medium hover:underline transition-colors">
                                                            {cv.Link_Penghubung}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    {/* Experience Grid */}
                                    <div className="w-full  border-gray-200">
                                        <h4 className="font-bold text-gray-800 text-lg mb-6">Pengalaman</h4>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-xl border border-orange-100">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <h5 className="font-semibold text-gray-800 text-sm">Pengalaman Project</h5>
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed">{cv.Pengalaman_Project}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                                        </svg>
                                                    </div>
                                                    <h5 className="font-semibold text-gray-800 text-sm">Pengalaman Organisasi</h5>
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed">{cv.Pengalaman_Organisasi}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-5 rounded-xl border border-teal-100">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                                        </svg>
                                                    </div>
                                                    <h5 className="font-semibold text-gray-800 text-sm">Pengalaman Pelatihan</h5>
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed">{cv.Pengalaman_Pelatihan}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Modal for Edit CV */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Edit CV
                                </h2>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Personal</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={formData.Nama}
                                            onChange={(e) => handleInputChange('Nama', e.target.value)}
                                            className={`${inputClasses} h-9 text-sm ${errors.Nama ? 'border-red-500' : ''}`}
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.Email}
                                            onChange={(e) => handleInputChange('Email', e.target.value)}
                                            className={`${inputClasses} h-9 text-sm ${errors.Nama ? 'border-red-500' : ''}`}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                                        <input
                                            type="tel"
                                            value={formData.Telepon}
                                            onChange={(e) => handleInputChange('Telepon', e.target.value)}
                                            className={`${inputClasses} h-9 text-sm ${errors.Nama ? 'border-red-500' : ''}`}
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            value={formData.Tanggal_Lahir}
                                            onChange={(e) => handleInputChange('Tanggal_Lahir', e.target.value)}
                                            className={`${inputClasses} h-9 text-sm ${errors.Nama ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                        <select
                                            value={formData.Gender}
                                            onChange={(e) => handleInputChange('Gender', e.target.value)}
                                            className={`${inputClasses} h-9 text-sm ${errors.Nama ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Pilih Gender</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                                        <textarea
                                            value={formData.Alamat}
                                            onChange={(e) => handleInputChange('Alamat', e.target.value)}
                                            rows={3}
                                            className="outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondaryz"
                                            placeholder="Alamat lengkap"
                                        />
                                    </div>
                                </div>
                                
                                {/* Skills & Experience */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Keahlian & Pengalaman</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bidang</label>
                                        <input
                                            type="text"
                                            value={formData.Bidang}
                                            onChange={(e) => handleInputChange('Bidang', e.target.value)}
                                            className={`${inputClasses} h-9 text-sm ${errors.Nama ? 'border-red-500' : ''}`}
                                            placeholder="Misalnya: Web Development, Data Science"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Keterampilan</label>
                                        <textarea
                                            value={formData.Keterampilan}
                                            onChange={(e) => handleInputChange('Keterampilan', e.target.value)}
                                            rows={3}
                                            className="outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondaryz"
                                            placeholder="Daftar keterampilan yang dikuasai"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Link Portfolio</label>
                                        <input
                                            type="url"
                                            value={formData.Link_Penghubung}
                                            onChange={(e) => handleInputChange('Link_Penghubung', e.target.value)}
                                            className={`${inputClasses} h-9 text-sm ${errors.Nama ? 'border-red-500' : ''}`}
                                            placeholder="https://portfolio-anda.com"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ringkasan</label>
                                        <textarea
                                            value={formData.Ringkasan}
                                            onChange={(e) => handleInputChange('Ringkasan', e.target.value)}
                                            rows={4}
                                            className="outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondaryz"
                                            placeholder="Ringkasan singkat tentang diri Anda"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Experience Section */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengalaman</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Project</label>
                                        <textarea
                                            value={formData.Pengalaman_Project}
                                            onChange={(e) => handleInputChange('Pengalaman_Project', e.target.value)}
                                            rows={4}
                                            className="outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondaryz"
                                            placeholder="Deskripsi pengalaman project"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Organisasi</label>
                                        <textarea
                                            value={formData.Pengalaman_Organisasi}
                                            onChange={(e) => handleInputChange('Pengalaman_Organisasi', e.target.value)}
                                            rows={4}
                                            className="outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondaryz"
                                            placeholder="Deskripsi pengalaman organisasi"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Pelatihan</label>
                                        <textarea
                                            value={formData.Pengalaman_Pelatihan}
                                            onChange={(e) => handleInputChange('Pengalaman_Pelatihan', e.target.value)}
                                            rows={4}
                                            className="outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondaryz"
                                            placeholder="Deskripsi pengalaman pelatihan"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/80  transition duration-200"
                            >
                                Update CV
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}