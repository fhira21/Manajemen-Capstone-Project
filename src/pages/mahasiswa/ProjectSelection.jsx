import PageTitle from "../../components/PageTitle";
import PROPOSAL from '../../data/proposal.json';  
import MITRA from '../../data/mitra.json';
import Button from "../../components/buttonPrimary";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCategoryColor } from '../../utils/categoryColors';

export default function ProjectSelection() {
    const [searchText, setSearchText] = useState("");
    const [filteredProposals, setFilteredProposals] = useState(PROPOSAL.PROPOSAL || []);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTeamSize, setSelectedTeamSize] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(""); // Added for Mitra status filtering
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [mitraId, setMitraId] = useState(null);
  
    const inputClasses = 'w-full rounded h-10 p-2 border-2 focus:outline-none focus:ring-2 focus:ring-secondary';

    // Get all unique categories from proposals
    const allCategories = [...new Set(PROPOSAL.PROPOSAL?.flatMap(p => p.Kategori_Project || []))];

    // Load applied projects from localStorage on component mount
    useEffect(() => {
        const savedAppliedProjects = localStorage.getItem('appliedProjects');
        if (savedAppliedProjects) {
            setAppliedProjects(JSON.parse(savedAppliedProjects));
        }

        // Get user role from localStorage
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        // If user is a Mitra, get their ID
        if (role === 'Mitra') {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            if (loggedInUser) {
                // Find the mitra associated with this user
                const loggedInMitra = MITRA.MITRA.find(m => m.ID_User === loggedInUser.id);
                if (loggedInMitra) {
                    setMitraId(loggedInMitra.ID_Mitra);
                }
            }
        }
    }, []);

    // Filter proposals based on search text, categories, team size, status, and user role
    useEffect(() => {
        if (!PROPOSAL.PROPOSAL) return;

        let filtered = [...PROPOSAL.PROPOSAL];

        // If user is Mitra, only show their own projects
        if (userRole === 'Mitra' && mitraId) {
            filtered = filtered.filter(project => project.ID_Mitra === mitraId);
        }
        
        if (searchText) {
            filtered = filtered.filter(project => 
                project.Judul_Project.toLowerCase().includes(searchText.toLowerCase()) ||
                (project.Deskripsi_Masalah && project.Deskripsi_Masalah.toLowerCase().includes(searchText.toLowerCase())) ||
                (project.Kategori_Project && project.Kategori_Project.some(cat => 
                    cat.toLowerCase().includes(searchText.toLowerCase())
                ))
            );
        }
        
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(project => 
                project.Kategori_Project && 
                selectedCategories.some(cat => project.Kategori_Project.includes(cat))
            );
        }
        
        if (selectedTeamSize) {
            filtered = filtered.filter(project => {
                const size = project.Jumlah_orang || 0;
                if (selectedTeamSize === "1-2") return size >= 1 && size <= 2;
                if (selectedTeamSize === "3-5") return size >= 3 && size <= 5;
                if (selectedTeamSize === "5+") return size > 5;
                return true;
            });
        }
        
        // Filter by status (only for Mitra)
        if (selectedStatus && userRole === 'Mitra') {
            filtered = filtered.filter(project => project.status === selectedStatus);
        }
        
        setFilteredProposals(filtered);
    }, [searchText, selectedCategories, selectedTeamSize, selectedStatus, userRole, mitraId]);

    // Toggle filter dropdown
    const toggleFilterDropdown = () => {
        document.getElementById('filterDropdown').classList.toggle('hidden');
    };
    
    // Close filter dropdown
    const closeFilterDropdown = () => {
        document.getElementById('filterDropdown').classList.add('hidden');
    };

    // Apply filters
    const applyFilters = () => {
        closeFilterDropdown();
    };
    
    // Reset filters
    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedTeamSize("");
        setSelectedStatus("");
        closeFilterDropdown();
    };

    // Handle apply to project
    const handleApplyProject = (projectId) => {
        // Add project to applied projects
        const updatedAppliedProjects = [...appliedProjects, projectId];
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

    // Handle category selection (multiple)
    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    // Handle showing project details - checks role before redirecting
    const navigate = useNavigate();
    
    // Handle back button navigation
    const handleBack = () => {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'Mahasiswa') {
            navigate('/student/dashboard');
        } else if (userRole === 'Mitra') {
            navigate('/partner/dashboard');
        } else {
            navigate('/');
        }
    };
    
    const handleShowDetails = (project) => {
        // Get user role from localStorage
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === 'Mahasiswa') {
            // If user is a student, navigate to student's project detail page
            navigate(`/student/project-detail/${project.ID_Proposal}`);
        } else if (userRole === 'Mitra') {
            // If user is a partner, navigate to partner's project detail page
            navigate(`/partner/project-detail/${project.ID_Proposal}`);
        } else {
            // For other roles, show message that they can't access details
            toast.info('Only students and partners can view full project details', {
                position: "top-center",
                autoClose: 3000
            });
        }
    };



    return (
        <>
            <PageTitle 
                title={userRole === 'Mitra' ? "Your Projects" : "Project Selection"}
                description={userRole === 'Mitra' 
                    ? "Manage and monitor your submitted projects. View status updates and student applications for your projects."
                    : "Select a project to view details, manage tasks, and collaborate with team members. This section allows you to efficiently navigate through available projects."
                }
            />
            
            {/* Toast Container */}
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
        
            <div className="flex flex-col items-center h-full justify-start gap-4">

                <div className="w-full gap-2 flex flex-col relative">
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="flex flex-1 gap-2">
                            <input 
                                type="text" 
                                placeholder="Cari proyek..." 
                                className={inputClasses}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />              
                            <button
                                className="bg-secondary w-10 h-10 items-center flex justify-center rounded-md hover:bg-secondary/80"
                                onClick={toggleFilterDropdown}
                            >
                                <img src="/assets/icons/icons8-filter-100.png" alt="Filter Icon" className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Submit Proposal button next to filter on larger screens */}
                        {userRole === 'Mitra' && (
                            <button
                                onClick={() => navigate('/partner/form-pengajuan-projek')}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Ajukan Proyek Baru
                            </button>
                        )}
                    </div>

                    {/* Filter dropdown */}
                    <div id="filterDropdown" className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-md border p-3 z-10 hidden">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">Filter</h3>
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={closeFilterDropdown}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">Kategory Proyek</label>
                            <div className="max-h-40 overflow-y-auto border rounded p-2">
                                {allCategories.map((category, idx) => (
                                    <div key={idx} className="flex items-center mb-1">
                                        <input 
                                            type="checkbox" 
                                            id={`cat-${idx}`}
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`cat-${idx}`} className="text-sm">
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">Banyaknya anggota</label>
                            <select 
                                className={inputClasses}
                                value={selectedTeamSize}
                                onChange={(e) => setSelectedTeamSize(e.target.value)}
                            >
                                <option value="">Anggota</option>
                                <option value="1-2">1-2 Anggota</option>
                                <option value="3-5">3-5 Anggota</option>
                                <option value="5+">5+ Anggota</option>
                            </select>
                        </div>
                        
                        {/* Status filter only for Mitra users */}
                        {userRole === 'Mitra' && (
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Status Proyek</label>
                                <select 
                                    className={inputClasses}
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Menunggu">Menunggu</option>
                                    <option value="Disetujui">Disetujui</option>
                                    <option value="Ditolak">Ditolak</option>
                                </select>
                            </div>
                        )}
                        <div className="flex justify-end gap-2 mt-2">
                            <button 
                                className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                                onClick={resetFilters}
                            >Atur ulang</button>
                            <button 
                                className="px-3 py-1 text-sm bg-secondary text-white rounded"
                                onClick={applyFilters}
                            >Terapkan</button>
                        </div>
                    </div>
                    
                    {(selectedCategories.length > 0 || selectedTeamSize || selectedStatus) && (
                        <div className="w-full flex flex-wrap gap-2 items-center">
                            <p>Filter: </p>
                            {selectedCategories.map((category, index) => (
                                <span 
                                    key={index} 
                                    className="font-medium text-[0.6rem] p-1 border text-center rounded-xl"
                                    style={{
                                        backgroundColor: `${getCategoryColor(category)}20`,
                                        color: getCategoryColor(category)
                                    }}  
                                >
                                    {category}
                                    <button
                                        className="text-white ml-1 bg-red-600 w-4 h-4 rounded-full"
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                            {selectedTeamSize && (
                                <span 
                                    className="font-medium text-[0.6rem] p-1 border text-center rounded-xl"
                                    style={{
                                        backgroundColor: "#F0F0F0",
                                        color: "#333333"
                                    }}  
                                >
                                    {selectedTeamSize === "1-2" ? "1-2 Anggota" : 
                                     selectedTeamSize === "3-5" ? "3-5 Anggota" : 
                                     "5+ Anggota"}
                                    <button
                                        className="text-white ml-1 bg-red-600 w-4 h-4 rounded-full"
                                        onClick={() => setSelectedTeamSize("")}
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {selectedStatus && (
                                <span 
                                    className={`font-medium text-[0.6rem] p-1 border text-center rounded-xl ${
                                        selectedStatus === "Menunggu" ? "bg-yellow-100 text-yellow-800" :
                                        selectedStatus === "Disetujui" ? "bg-green-100 text-green-800" :
                                        selectedStatus === "Ditolak" ? "bg-red-100 text-red-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    Status: {selectedStatus}
                                    <button
                                        className="text-white ml-1 bg-red-600 w-4 h-4 rounded-full"
                                        onClick={() => setSelectedStatus("")}
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>



                <div className="scrollbar-primary h-full w-full overflow-y-auto">
                    <div className="scrollbar-primary h-full w-full overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProposals.length > 0 ? (
                                filteredProposals.map((project) => (
                                    <div key={project.ID_Proposal} className="flex flex-col border-2 justify-around gap-5 items-center rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                        <div 
                                            className="w-full flex flex-col items-center justify-center font-bold h-[90px] rounded-md relative"
                                            style={{ 
                                                backgroundColor: `${getCategoryColor(project.Judul_Project)}20` 
                                            }}
                                        >
                                            {/* Status badge for Mitra view */}
                                            {userRole === 'Mitra' && (
                                                <span 
                                                    className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${
                                                        project.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" :
                                                        project.status === "Disetujui" ? "bg-green-100 text-green-800" :
                                                        project.status === "Ditolak" ? "bg-red-100 text-red-800" :
                                                        "bg-blue-100 text-blue-800"
                                                    }`}
                                                >
                                                    {project.status || "Menunggu"}
                                                </span>
                                            )}
                                            
                                            <p className="w-full text-center text-xs" 
                                               style={{ 
                                                   color: getCategoryColor(project.Judul_Project) 
                                               }}
                                            >
                                                {project.Judul_Project}
                                            </p>
                                        </div>
                                           
                                        <div className="w-full flex flex-wrap gap-2">
                                            {project.Kategori_Project && project.Kategori_Project.map((category, index) => (
                                                <span 
                                                    key={index} 
                                                    className="font-medium text-[0.6rem] p-1 border text-center rounded-xl"
                                                    style={{ 
                                                        backgroundColor: `${getCategoryColor(category)}20`, 
                                                        color: getCategoryColor(category) 
                                                    }}
                                                >
                                                    {category}{index < project.Kategori_Project.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <div className="w-full">
                                            <p className="h-min-[200px]">{project.Deskripsi_Masalah}</p> 
                                        </div>

                                        <div className="w-full">
                                            <Button
                                                className='bg-secondary'
                                                label="Detail"
                                                onClick={() => handleShowDetails(project)}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 flex flex-col justify-center items-center p-10 text-center">
                                    <p className="text-gray-500 mb-2">
                                        {userRole === 'Mitra' 
                                            ? "Anda belum memiliki proyek yang diajukan." 
                                            : "Tidak ada proyek yang ditemukan."
                                        }
                                    </p>
                                    <div className="text-sm text-gray-400">
                                        {searchText && (
                                            <p>Pencarian: "{searchText}"</p>
                                        )}
                                        {selectedCategories.length > 0 && (
                                            <p>Kategori: {selectedCategories.join(", ")}</p>
                                        )}
                                        {selectedTeamSize && (
                                            <p>Anggota: {
                                                selectedTeamSize === "1-2" ? "1-2 orang" : 
                                                selectedTeamSize === "3-5" ? "3-5 orang" : "5+ orang"
                                            }</p>
                                        )}
                                        {selectedStatus && (
                                            <p>Status: {selectedStatus}</p>
                                        )}
                                        <p className="mt-2">
                                            {userRole === 'Mitra' && !searchText && !selectedCategories.length && !selectedTeamSize && !selectedStatus
                                                ? "Klik 'Ajukan Proyek Baru' untuk mengajukan proyek baru."
                                                : "Coba menggunakan kata kunci lain atau mengatur ulang filter."
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}