import { useState } from "react";
import PageTitle from "../../components/PageTitle";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

export default function AddCurriculumVitae() {
    const inputClasses = 'w-full border-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-secondary';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
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
        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const handleSaveAdditionalInfo = () => {
        // Validate additional info fields
        const newErrors = {...errors};
        let isValid = true;
        
        // Check required fields
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
            
            // Process bidang and keterampilan
            if (additionalInfo.bidang) {
                handleMultiInputChange('bidang', additionalInfo.bidang);
            }
            
            if (additionalInfo.keterampilan) {
                handleMultiInputChange('keterampilan', additionalInfo.keterampilan);
            }
            
            // Show success message
            toast.success("Informasi tambahan berhasil disimpan", {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    // State to hold the form data
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

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Clear error for this field if it exists
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    // Handle multi-select changes (bidang and keterampilan)
    const handleMultiInputChange = (field, value) => {
        // Split by comma and trim whitespace
        const items = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({
            ...prev,
            [field]: items
        }));
        // Clear error for this field if it exists
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        // Required fields validation
        const requiredFields = [
            'nama', 'tanggal_lahir', 'gender', 'email', 
            'telepon', 'email_aktif', 'alamat', 'ringkasan'
        ];
        
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'Field ini wajib diisi';
            }
        });

        // Validate additional fields
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
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (formData.email_aktif && !emailRegex.test(formData.email_aktif)) {
            newErrors.email_aktif = 'Format email tidak valid';
        }
        
        // Phone number validation (simple)
        const phoneRegex = /^[0-9+\-\s]+$/;
        if (formData.telepon && !phoneRegex.test(formData.telepon)) {
            newErrors.telepon = 'Nomor telepon hanya boleh berisi angka, +, -';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate the form
        const isValid = validateForm();
        
        if (isValid) {
            // Combine formData with additionalInfo
            const finalData = { 
                ...formData, 
                pengalaman_project: additionalInfo.pengalaman_project,
                pengalaman_organisasi: additionalInfo.pengalaman_organisasi,
                pengalaman_pelatihan: additionalInfo.pengalaman_pelatihan
            };
            console.log("CV Data to submit:", finalData);
            // Here you would send the data to your backend
            
            // Show success notification
            toast.success("Curriculum Vitae berhasil ditambahkan!", {
                position: "top-center",
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
            
            // Reset form
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
        } else {
            // Show error notification
            toast.error("Mohon lengkapi semua field yang wajib diisi", {
                position: "top-center",
                autoClose: 5000
            });
            
            // Scroll to the first error
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    return (
        <>
            <PageTitle
                title="Add Curriculum Vitae"
                description="Add a new curriculum vitae to the system. This section allows you to upload and manage CVs for candidates."
            />

            {/* Add ToastContainer to render notifications */}
            <ToastContainer position="top-right" />

            <div className="w-full flex flex-col justify-start items-center">
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
                            className={`${inputClasses} h-auto resize-none text-sm ${errors.ringkasan ? 'border-red-500' : ''}`}
                            placeholder="Tuliskan ringkasan profil anda"
                            value={formData.ringkasan}
                            onChange={handleChange}
                        ></textarea>
                        {errors.ringkasan && <p className="text-red-500 text-xs mt-1">{errors.ringkasan}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="w-full flex justify-start gap-4 mt-4">
                        <button 
                            type="button" 
                            className="px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center gap-2 text-sm"
                            onClick={handleOpenModal}
                        >
                            <img src="/assets/icons/icons8-add-100.png" alt="Add icon" className="w-4 h-4" />
                            Hal Lain
                        </button>
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition text-sm"
                        >
                            Tambahkan CV
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal for "Hal Lain" button */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
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
                                aria-label="Close"
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
                        <div className="flex gap-2 items-center p-2">


                            <button 
                                onClick={handleCloseModal} 
                                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 transition text-sm"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSaveAdditionalInfo} 
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition text-sm"
                            >
                                Simpan Informasi
                            </button>
                        </div>

                        </div>
                    </div>
            )}
        </>
    );
}