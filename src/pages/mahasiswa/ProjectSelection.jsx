import PageTitle from "../../components/PageTitle";
import PROJECT from '../../data/project.json';
import PROPOSAL from '../../data/proposal.json';  
import MITRA from '../../data/mitra.json';
import USER from '../../data/user.json';
import Button from "../../components/buttonPrimary";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCategoryColor } from '../../utils/categoryColors';

export default function ProjectSelection() {
    const [searchText, setSearchText] = useState("");
    const [filteredProposals, setFilteredProposals] = useState(PROPOSAL.PROPOSAL || []);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTeamSize, setSelectedTeamSize] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedMitra, setSelectedMitra] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [appliedProjects, setAppliedProjects] = useState([]);
  
    const inputClasses = 'w-full rounded h-10 p-2 border-2 focus:outline-none focus:ring-2 focus:ring-secondary';

    // Get all unique categories from proposals
    const allCategories = [...new Set(PROPOSAL.PROPOSAL?.flatMap(p => p.Kategori_Project || []))];

    // Handle apply to project
    const handleApplyProject = (projectId) => {
        // Add project to applied projects
        setAppliedProjects([...appliedProjects, projectId]);
        
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

    // Handle showing project details
    const handleShowDetails = (project) => {
        setSelectedProject(project);
        
        // Find related mitra data
        const mitra = MITRA.MITRA.find(m => m.ID_Mitra === project.ID_Mitra);
        setSelectedMitra(mitra);
        
        // Find related user data
        if (mitra) {
            const user = USER.USER.find(u => u.ID_User === mitra.ID_User);
            setSelectedUser(user);
        }
        
        setShowDetails(true);
    };

    // Handle closing project details
    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedProject(null);
        setSelectedMitra(null);
        setSelectedUser(null);
    };

    // Filter proposals based on search text, categories, and team size
    useEffect(() => {
        if (!PROPOSAL.PROPOSAL) return;

        let filtered = [...PROPOSAL.PROPOSAL];
        
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
        
        setFilteredProposals(filtered);
    }, [searchText, selectedCategories, selectedTeamSize]);

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
        closeFilterDropdown();
    };

    return (
        <>
            <PageTitle 
                title="Project Selection"
                description="Select a project to view details, manage tasks, and collaborate with team members. This section allows you to efficiently navigate through your projects."
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
                    <div className="flex gap-2 w-full">
                        <input 
                            type="text" 
                            placeholder="Cari proyek..." 
                            className={inputClasses}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />              
                        <button
                            className="bg-secondary  w-10 h-10 items-center flex justify-center rounded-md  hover:bg-secondary/80 "
                            onClick={toggleFilterDropdown}
                        >
                            <img src="/assets/icons/icons8-filter-100.png" alt="Filter Icon" className="w-5 h-5" />
                        </button>

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
                    
                    {(selectedCategories.length > 0 || selectedTeamSize) && (
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
                        </div>
                    )}
                </div>

                {/* Enhanced modal detail proyek */}
                <div className={`fixed inset-0 z-50 ${showDetails ? 'block' : 'hidden'} bg-black bg-opacity-50 flex items-center justify-center`}>
                    <div className="bg-white w-4/5 max-w-4xl p-6 rounded-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {selectedProject?.ID_Proposal}
                                </span>
                            </div>
                            <button 
                                className="text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-400 transition-colors" 
                                onClick={handleCloseDetails}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Kolom utama */}
                            <div className="md:col-span-2">
                                <h1 className="text-2xl font-bold mb-2">{selectedProject?.Judul_Project}</h1>
                                
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <img 
                                            src={selectedMitra?.Foto_Profile || 'https://via.placeholder.com/40'} 
                                            alt="Profile Mitra" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">{selectedMitra?.Nama_Perusahaan || 'Nama Mitra'}</p>
                                        <p className="text-sm text-gray-500">{selectedMitra?.No_Telepon || 'No. Telp Mitra'}</p>
                                        {selectedUser?.Email && (
                                            <p className="text-sm text-gray-500">{selectedUser?.Email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2">Deskripsi Masalah</h2>
                                    <p className="text-gray-700">{selectedProject?.Deskripsi_Masalah}</p>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2">Tujuan Proyek</h2>
                                    <p className="text-gray-700">{selectedProject?.Goals}</p>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2">Informasi Tambahan</h2>
                                    <p className="text-gray-700">{selectedProject?.Informasi_Tambahan}</p>
                                </div>
                            </div>

                            {/* Kolom sidebar */}
                            <div className="md:col-span-1">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-3">Detail Proyek</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Kategori</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {selectedProject?.Kategori_Project?.map((kategori, index) => (
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
                                            <p className="font-medium">{selectedProject?.Jumlah_orang} orang</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">Kontak Mitra</p>
                                            <p className="font-medium">{selectedMitra?.No_Telepon || 'No. Telp Mitra'}</p>
                                            {selectedUser?.Email && (
                                                <p className="text-sm text-gray-600">{selectedUser?.Email}</p>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t">
                                            {isProjectApplied(selectedProject?.ID_Proposal) ? (
                                                <button
                                                    className="font-normal text-sm bg-green-500 w-full text-white rounded-lg py-2 cursor-default"
                                                    disabled
                                                >
                                                    Lamaran Terkirim ✓
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleApplyProject(selectedProject?.ID_Proposal)}
                                                    className="font-normal text-sm bg-secondary w-full text-white rounded-lg py-2 hover:bg-secondary/80 transition-colors"
                                                >
                                                    Ajukan Diri untuk Proyek Ini
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="scrollbar-primary h-full w-full overflow-y-auto">
                    <div className="scrollbar-primary h-full w-full overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProposals.length > 0 ? (
                                filteredProposals.map((project) => (
                                    <div key={project.ID_Proposal} className="flex flex-col border-2 justify-around gap-5 items-center rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                        <div 
                                            className="w-full flex items-center justify-center font-bold h-[90px] rounded-md"
                                            style={{ 
                                                backgroundColor: `${getCategoryColor(project.Judul_Project)}20` 
                                            }}
                                        >
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
                                    <p className="text-gray-500 mb-2">Tidak ada proyek yang ditemukan.</p>
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
                                        <p className="mt-2">Coba menggunakan kata kunci lain atau mengatur ulang filter.</p>
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