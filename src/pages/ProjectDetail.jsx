import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "../components/buttonPrimary";
import PROPOSAL from '../data/proposal.json';  
import MITRA from '../data/mitra.json';
import USER from '../data/user.json';
import PENDAFTAR from '../data/Pendaftar(dosen).json';
import COMMENTS from '../data/comments.json';
import MAHASISWA from '../data/mahasiswa.json';
import CV from '../data/cv.json';
import { getCategoryColor } from '../utils/categoryColors';

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [mitra, setMitra] = useState(null);
    const [user, setUser] = useState(null);
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [isProjectOwner, setIsProjectOwner] = useState(false); // To check if the logged-in Mitra owns this project
    const [projectApplicants, setProjectApplicants] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [projectComments, setProjectComments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [applicantCV, setApplicantCV] = useState(null);
    const [applicantData, setApplicantData] = useState(null);

    useEffect(() => {
        // Check user role from localStorage
        const role = localStorage.getItem('userRole');
        setUserRole(role);
        
        // Check if user is authorized (only Mahasiswa and Mitra can access)
        if (role !== 'Mahasiswa' && role !== 'Mitra') {
            setUnauthorized(true);
            setLoading(false);
            return;
        }
        
        // Find project data based on ID from URL
        const foundProject = PROPOSAL.PROPOSAL.find(p => p.ID_Proposal === id);
        if (foundProject) {
            setProject(foundProject);
            
            // Find related mitra data
            const relatedMitra = MITRA.MITRA.find(m => m.ID_Mitra === foundProject.ID_Mitra);
            if (relatedMitra) {
                setMitra(relatedMitra);
                
                // Find related user data
                const relatedUser = USER.USER.find(u => u.ID_User === relatedMitra.ID_User);
                if (relatedUser) {
                    setUser(relatedUser);
                }
            }

            // Check if the logged-in user is the mitra who owns this project
            if (role === 'Mitra') {
                // Get logged in user data
                const loggedInUser = JSON.parse(localStorage.getItem('user'));
                if (loggedInUser) {
                    // Find the mitra associated with this user
                    const loggedInMitra = MITRA.MITRA.find(m => m.ID_User === loggedInUser.id);
                    if (loggedInMitra && loggedInMitra.ID_Mitra === foundProject.ID_Mitra) {
                        setIsProjectOwner(true);
                    }
                }
            }
            
            // Load applicants for this project
            const projectPendaftar = PENDAFTAR.PENDFTAR.filter(p => p.ID_Proposal === id);
            setProjectApplicants(projectPendaftar);
            
            // Load comments for this project
            const projectLecturerComments = COMMENTS.COMMENTS.filter(c => c.ID_Proposal === id);
            setProjectComments(projectLecturerComments);
        }
        
        // Load applied projects from localStorage (if available)
        const savedAppliedProjects = localStorage.getItem('appliedProjects');
        if (savedAppliedProjects) {
            setAppliedProjects(JSON.parse(savedAppliedProjects));
        }
        
        setLoading(false);
    }, [id]);

    // Handle apply to project
    const handleApplyProject = (projectId) => {
        const updatedAppliedProjects = [...appliedProjects, projectId];
        // Save to state
        setAppliedProjects(updatedAppliedProjects);
        
        // Save to localStorage for persistence
        localStorage.setItem('appliedProjects', JSON.stringify(updatedAppliedProjects));
        
        // Show success toast
        toast.success('Lamaran berhasil terkirim!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    // Check if project is already applied
    const isProjectApplied = (projectId) => {
        return appliedProjects.includes(projectId);
    };

    // Go back to previous page or navigate based on user role
    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1); // Go back if there's a history
        } else {
            // If accessed directly, navigate based on user role
            const role = localStorage.getItem('userRole');
            if (role === 'Mahasiswa') {
                navigate('/student/project-selection'); // More appropriate to go to project selection
            } else if (role === 'Mitra') {
                navigate('/partner/dashboard');
            } else {
                navigate('/');
            }
        }
    };

    // Open CV modal with applicant data
    const openCVModal = (applicant) => {
        setSelectedApplicant(applicant);
        // Find the mahasiswa data by ID
        const mahasiswa = MAHASISWA.MAHASISWA.find(m => m.ID_Mahasiswa === applicant.ID_Mahasiswa);
        setApplicantData(mahasiswa);
        
        // Find the CV data if it exists
        if (mahasiswa && mahasiswa.ID_CV) {
            const cv = CV.CV_Mahasiswa.find(c => c.ID_CV === mahasiswa.ID_CV);
            setApplicantCV(cv);
        } else {
            setApplicantCV(null);
        }
        
        setIsModalOpen(true);
    };

    // Close CV modal
    const closeCVModal = () => {
        setIsModalOpen(false);
        setSelectedApplicant(null);
        setApplicantCV(null);
        setApplicantData(null);
    };
    
    // Handle approve applicant
    const handleApproveApplicant = (applicant) => {
        // Show confirmation dialog
        if (window.confirm(`Apakah Anda yakin ingin menyetujui pendaftar ${applicant?.Nama || ''}?`)) {
            // In a real application, this would make an API call to update the status
            // Update the UI with toast notification
            toast.success(`Pendaftar ${applicant?.Nama || ''} berhasil disetujui!`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            // Update the applicant in the local state
            const updatedApplicants = projectApplicants.map(a => 
                a.ID_PENDAFTAR === applicant.ID_PENDAFTAR ? {...a, Status: "Disetujui"} : a
            );
            setProjectApplicants(updatedApplicants);
            closeCVModal();
        }
    };
    
    // Handle reject applicant
    const handleRejectApplicant = (applicant) => {
        // Show confirmation dialog
        if (window.confirm(`Apakah Anda yakin ingin menolak pendaftar ${applicant?.Nama || ''}?`)) {
            // In a real application, this would make an API call to update the status
            // Update the UI with toast notification
            toast.error(`Pendaftar ${applicant?.Nama || ''} ditolak.`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            // Update the applicant in the local state
            const updatedApplicants = projectApplicants.map(a => 
                a.ID_PENDAFTAR === applicant.ID_PENDAFTAR ? {...a, Status: "Ditolak"} : a
            );
            setProjectApplicants(updatedApplicants);
            closeCVModal();
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (unauthorized) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-bold mb-4">Unauthorized Access</h2>
                <p className="text-gray-600 mb-4">Only students (Mahasiswa) and partners (Mitra) can access project details.</p>
                <Button 
                    label="Go Back" 
                    className="bg-secondary"
                    onClick={handleGoBack}
                />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-bold mb-4">Project Not Found</h2>
                <Button 
                    label="Go Back" 
                    className="bg-secondary"
                    onClick={handleGoBack}
                />
            </div>
        );
    }

    // Filter applicants by status
    const filteredApplicants = statusFilter === 'Semua'
        ? projectApplicants
        : projectApplicants.filter(a => a.Status === statusFilter);

    return (
        <>
            <PageTitle 
                title="Project Detail"
                description="Detailed information about the selected project."
            />
            
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>
                </div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {project.ID_Proposal}
                </span>
            </div>

            <div className="bg-white  rounded-lg shadow-md h-full p-8 overflow-y-auto ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main column */}
                    <div className="md:col-span-2">
                        <h1 className="text-2xl font-bold mb-2">{project.Judul_Project}</h1>
                        
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img 
                                    src={mitra?.Foto_Profile || 'https://via.placeholder.com/40'} 
                                    alt="Profile Mitra" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-medium">{mitra?.Nama_Perusahaan || 'Nama Mitra'}</p>
                                <p className="text-sm text-gray-500">{mitra?.No_Telepon || 'No. Telp Mitra'}</p>
                                {user?.Email && (
                                    <p className="text-sm text-gray-500">{user.Email}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Deskripsi Masalah</h2>
                            <p className="text-gray-700">{project.Deskripsi_Masalah}</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Tujuan Proyek</h2>
                            <p className="text-gray-700">{project.Goals}</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Informasi Tambahan</h2>
                            <p className="text-gray-700">{project.Informasi_Tambahan}</p>
                        </div>

                        {/* Lecturer Comments Section */}
                        <div className="mb-6 border-t pt-6">
                            <h2 className="text-lg font-semibold mb-4">Komentar Dosen</h2>
                            {projectComments.length > 0 ? (
                                <div className="space-y-4">
                                    {projectComments.map((comment) => (
                                        <div key={comment.ID_Comment} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                                                        {comment.Nama.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{comment.Nama}</p>
                                                        <p className="text-xs text-gray-500">{comment.Tanggal}</p>
                                                    </div>
                                                </div>
                                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                                    Dosen
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mt-2">{comment.Comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Belum ada komentar dari dosen.</p>
                            )}
                        </div>

                        {/* Applicants Section - Only visible for project owner (mitra) */}
                        {isProjectOwner && (
                            <div className="mb-6 border-t pt-6">
                                <h2 className="text-lg font-semibold mb-4">Daftar Pendaftar</h2>
                                {/* Filter by Status */}
                                <div className="mb-4 flex flex-wrap gap-2 items-center">
                                    <label className="text-sm font-medium text-gray-700">Filter Status:</label>
                                    <select
                                        className="border rounded px-2 py-1 text-sm"
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value)}
                                    >
                                        <option value="Semua">Semua</option>
                                        <option value="Menunggu">Menunggu</option>
                                        <option value="Disetujui">Disetujui</option>
                                        <option value="Ditolak">Ditolak</option>
                                    </select>
                                </div>
                                {filteredApplicants.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                                                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {filteredApplicants.map((applicant) => (
                                                    <tr key={applicant.ID_PENDAFTAR}>
                                                        <td className="py-3 px-3">{applicant.Nama}</td>
                                                        <td className="py-3 px-3">{applicant["Tanggal Daftar"]}</td>
                                                        <td className="py-3 px-3">
                                                            <span 
                                                                className={`inline-block px-2 py-1 text-xs rounded ${
                                                                    applicant.Status === "Disetujui" ? "bg-green-100 text-green-800" :
                                                                    applicant.Status === "Ditolak" ? "bg-red-100 text-red-800" :
                                                                    "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                            >
                                                                {applicant.Status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
                                                                    onClick={() => openCVModal(applicant)}
                                                                >
                                                                    Lihat Detail
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Belum ada mahasiswa yang mendaftar dengan status ini.</p>
                                )}
                            </div>
                        )}

                    </div>

                    {/* Sidebar column */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3">Detail Proyek</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Kategori</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {project.Kategori_Project?.map((kategori, index) => (
                                            <span 
                                                key={index} 
                                                className="px-2 py-1 text-xs rounded"
                                                style={{
                                                    backgroundColor: `${getCategoryColor(kategori)}20`,
                                                    color: getCategoryColor(kategori)
                                                }}
                                            >
                                                {kategori}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Jumlah Anggota Dibutuhkan</p>
                                    <p className="font-medium">{project.Jumlah_orang} orang</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-500">Status Proyek</p>
                                    <p className="font-medium">
                                        <span 
                                            className={`inline-block px-2 py-1 text-xs rounded ${
                                                project.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" :
                                                project.status === "Disetujui" ? "bg-green-100 text-green-800" :
                                                project.status === "Ditolak" ? "bg-red-100 text-red-800" :
                                                "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {project.status || "Menunggu"}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                                    <p className="font-medium">{project.tanggal || "Tidak ada tanggal"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Kontak Mitra</p>
                                    <p className="font-medium">{mitra?.No_Telepon || 'No. Telp Mitra'}</p>
                                    {user?.Email && (
                                        <p className="text-sm text-gray-600">{user.Email}</p>
                                    )}
                                </div>

                                {/* Summary section for Applicants - visible for all */}
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-500">Jumlah Pendaftar</p>
                                    <p className="font-medium">{projectApplicants.length} mahasiswa</p>
                                </div>

                                {/* Only show apply button for Mahasiswa, not for Mitra */}
                                {userRole === 'Mahasiswa' && (
                                    <div className="pt-4 border-t">
                                        {isProjectApplied(project.ID_Proposal) ? (
                                            <button
                                                className="font-normal text-sm bg-green-500 w-full text-white rounded-lg py-2 cursor-default"
                                                disabled
                                            >
                                                Lamaran Terkirim ✓
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleApplyProject(project.ID_Proposal)}
                                                className="font-normal text-sm bg-secondary w-full text-white rounded-lg py-2 hover:bg-secondary/80 transition-colors"
                                            >
                                                Ajukan Diri untuk Proyek Ini
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CV Modal - Only for project owner (Mitra) */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-30" onClick={closeCVModal}></div>
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full z-10 overflow-y-auto max-h-[90vh]">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">CV {selectedApplicant?.Nama || "Pendaftar"}</h3>
                                <button 
                                    onClick={closeCVModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {applicantCV ? (
                                <div className="overflow-y-auto border p-5 gap-6 rounded-xl shadow flex flex-col justify-start items-start">
                                    <h1 className="w-full text-2xl font-bold border-b pb-3">Curriculum Vitae</h1>
                                    
                                    {/* Main Info Section with Personal Info and Skills side by side */}
                                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Personal Info Section */}
                                        <div className="lg:col-span-2">
                                            <h2 className="text-xl font-semibold mb-4 text-primary">Informasi Pribadi</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Nama</p>
                                                    <p className="text-base">{applicantData?.Nama || "Tidak Ada Data"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">NIM</p>
                                                    <p className="text-base">{applicantData?.NIM || "Tidak Ada Data"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Jenis Kelamin</p>
                                                    <p className="text-base">{applicantData?.Jenis_Kelamin || "Tidak Ada Data"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Nomor Telepon</p>
                                                    <p className="text-base">{applicantData?.No_Telepon || "Tidak Ada Data"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Alamat</p>
                                                    <p className="text-base">{applicantData?.Alamat || "Tidak Ada Data"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Link Penghubung</p>
                                                    <a href={applicantCV.Link_Penghubung} target="_blank" rel="noopener noreferrer" 
                                                    className="text-blue-500 hover:underline">
                                                        {applicantCV.Link_Penghubung}
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
                                                    {applicantCV.Bidang.split(',').map((bidang, index) => (
                                                        <span key={index} className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                                                            {bidang.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                                
                                                <p className="text-sm font-medium text-gray-500 mb-2">Keahlian</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {applicantCV.Keterampilan.split(',').map((skill, index) => (
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
                                            <p className="text-base">{applicantCV.Ringkasan_Profil || "Tidak Ada Data"}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Experience Section */}
                                    <div className="w-full mt-6">
                                        <h2 className="text-xl font-semibold mb-4 text-primary">Pengalaman</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Pengalaman Project</p>
                                                <p className="text-base mt-1 border p-3 rounded-lg bg-gray-50">{applicantCV.Pengalaman_Project}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Pengalaman Organisasi</p>
                                                <p className="text-base mt-1 border p-3 rounded-lg bg-gray-50">{applicantCV.Pengalaman_Organisasi}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Pengalaman Pelatihan</p>
                                                <p className="text-base mt-1 border p-3 rounded-lg bg-gray-50">{applicantCV.Pengalaman_Pelatihan}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-lg">Pendaftar ini belum memiliki CV yang tersedia untuk ditampilkan.</p>
                                </div>
                            )}
                        </div>
                        <div className="flex p-4 bg-gray-50">
                            {/* Action buttons - left side */}
                            <div className="flex-grow flex gap-3">
                                {selectedApplicant?.Status === "Menunggu" && (
                                    <>
                                        <button 
                                            onClick={() => handleApproveApplicant(selectedApplicant)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Setujui Pendaftar
                                        </button>
                                        <button 
                                            onClick={() => handleRejectApplicant(selectedApplicant)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Tolak Pendaftar
                                        </button>
                                    </>
                                )}
                            </div>
                            {/* Close button - right side */}
                            <div>
                                <button 
                                    onClick={closeCVModal}
                                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
