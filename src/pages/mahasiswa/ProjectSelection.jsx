import PageTitle from "../../components/PageTitle";
import PROJECT from '../../data/project.json';
import PROPOSAL from '../../data/proposal.json';  
import Button from "../../components/buttonPrimary";
import { useState, useEffect } from "react";

export default function ProjectSelection(params) {
    const [searchText, setSearchText] = useState("");
    const [filteredProposals, setFilteredProposals] = useState(PROPOSAL.PROPOSAL || []);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTeamSize, setSelectedTeamSize] = useState("");

    // Define colors for each letter A-Z
    const categoryColors = {
        A: "#FF6B6B", B: "#4ECDC4", C: "#FFD166", D: "#06D6A0", E: "#118AB2", 
        F: "#073B4C", G: "#8338EC", H: "#3A86FF", I: "#FB5607", J: "#FFBE0B",
        K: "#FF006E", L: "#8AC926", M: "#FFCC00", N: "#9B5DE5", O: "#F15BB5", 
        P: "#00BBF9", Q: "#00F5D4", R: "#EF476F", S: "#FCA311", T: "#14213D",
        U: "#E76F51", V: "#2A9D8F", W: "#E07A5F", X: "#81B29A", Y: "#F3D5B5", 
        Z: "#D62828"
    };

    // Function to get color based on first letter
    const getCategoryColor = (category) => {
        const firstLetter = category.charAt(0).toUpperCase();
        return categoryColors[firstLetter] || "#CCCCCC"; // Default gray if letter not found
    };
  
    const inputClasses = 'w-full rounded h-10 p-2 border-2  focus:outline-none focus:ring-2 focus:ring-secondary';

    // Get all unique categories from proposals
    const allCategories = [...new Set(PROPOSAL.PROPOSAL?.flatMap(p => p.Kategori_Project || []))];

    // Handle category selection (multiple)
    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            // Remove if already selected
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            // Add if not selected
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    // Filter proposals based on search text, categories, and team size
    useEffect(() => {
        if (!PROPOSAL.PROPOSAL) return;

        let filtered = [...PROPOSAL.PROPOSAL];
        
        // Filter by search text
        if (searchText) {
            filtered = filtered.filter(project => 
                project.Judul_Project.toLowerCase().includes(searchText.toLowerCase()) ||
                (project.Deskripsi_Masalah && project.Deskripsi_Masalah.toLowerCase().includes(searchText.toLowerCase())) ||
                (project.Kategori_Project && project.Kategori_Project.some(cat => 
                    cat.toLowerCase().includes(searchText.toLowerCase())
                ))
            );
        }
        
        // Filter by categories (multiple)
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(project => 
                project.Kategori_Project && 
                selectedCategories.some(cat => project.Kategori_Project.includes(cat))
            );
        }
        
        // Filter by team size
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
        
            <div className="flex flex-col items-center h-full justify-start gap-4 ">
                <div className="w-full gap-2 flex flex-col relative">
                    <div className="flex gap-2 w-full">
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            className={inputClasses}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />              
                        <Button
                            label="Filter"
                            className="bg-secondary w-max p-2 font-normal text-white"
                            leftIcon={<img src="/assets/icons/icons8-filter-100.png" alt="Filter Icon" className="w-5 h-5" />}
                            onClick={toggleFilterDropdown}
                        />
                    </div>

                    {/* Filter dropdown */}
                    <div id="filterDropdown" className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-md border p-3 z-10 hidden">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">Filters</h3>
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={closeFilterDropdown}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">Categories</label>
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
                            <label className="block text-sm font-medium mb-1">Team Size</label>
                            <select 
                                className={inputClasses}
                                value={selectedTeamSize}
                                onChange={(e) => setSelectedTeamSize(e.target.value)}
                            >
                                <option value="">Any Size</option>
                                <option value="1-2">1-2 members</option>
                                <option value="3-5">3-5 members</option>
                                <option value="5+">5+ members</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <button 
                                className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                                onClick={resetFilters}
                            >Reset</button>
                            <button 
                                className="px-3 py-1 text-sm bg-secondary text-white rounded"
                                onClick={applyFilters}
                            >Apply</button>
                        </div>
                    </div>
                </div>

                <div className="scrollbar-primary w-full h-[calc(100vh-200px)] overflow-y-auto  border-b-2 border-t-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ">
                        {/* card 3 baris */}    
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

                                    <div className="w-full flex flex-wrap gap-2 ">
                                        {project.Kategori_Project && project.Kategori_Project.map((category, index) => (
                                            <span 
                                                key={index} 
                                                className="font-medium text-[0.6rem] p-1 border  text-center  rounded-xl"
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
                                        <p className="font-semibold">Dibuthkan <span className="text-secondary">{project.Jumlah_orang}</span> Anggota</p>
                                    </div>
                                    
                                    <div className="w-full">
                                        <p className="h-min-[200px]">{project.Deskripsi_Masalah}</p> 
                                    </div>
                                    <div className="w-full">
                                        <Button
                                            className='bg-secondary'
                                            label="Detail"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 flex justify-center items-center p-10">
                                <p className="text-gray-500">No matching projects found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}