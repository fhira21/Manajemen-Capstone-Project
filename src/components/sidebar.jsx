import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <div className={`w-full h-screen flex flex-col items-center bg-primary overflow-hidden`}>
            
            {/* Header with logo and toggle button */}
            <div className={`w-full flex flex-col items-center  border-b p-2 gap-5`}>
                {/* Toggle button - relocated from Main component */}
                <div className={`flex  items-center w-full ${isOpen ? 'p-2 justify-end' : 'justify-center'} `}>
                    <button 
                        onClick={toggleSidebar}
                        className={`hidden md:flex hover:bg-secondary rounded-md transition-colors ${isOpen ? 'p-2' : 'p-2'}`}
                        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
                        {isOpen ? (
                            <img 
                                src="/assets/icons/icons8-sidebar-collapse-100.png" 
                                alt="Collapse sidebar" 
                                className="h-8 w-8" 
                            />
                        ) : (
                            <img 
                                src="/assets/icons/icons8-sidebar-open-100.png" 
                                alt="Expand sidebar" 
                                className="h-8 w-8" 
                            />
                        )}
                    </button>
                </div>
                
                <img src="/assets/logo.png" alt="Logo" className={`${isOpen ? 'w-20 h-20' : 'hidden'}`} />
                {isOpen && <h1 className="w-full text-center text-white text-xl font-bold">Manajemen Capstone</h1>}
            </div>

            {/* Scrollable container for navigation menus */}
            <div className="flex-grow w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                {/* Navigation menu - main items */}
                <ul className="w-full p-2">
                    <li className="w-full rounded">
                        <NavLink to="dashboard" className={({isActive}) => 
                            `flex items-center gap-2 text-white ${
                                isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                            } ${!isOpen && 'md:justify-center'}`
                        }>
                            <img src="/assets/icons/icons8-home-100.png" alt="Dashboard Icon" className="w-6 h-6" />
                            {isOpen && <span>Dashboard</span>}
                        </NavLink>
                    </li>

                    <li className="w-full rounded">
                        <NavLink to="add-curriculum-vitae" className={({isActive}) => 
                            `flex items-center gap-2 text-white ${
                                isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                            } ${!isOpen && 'md:justify-center'}`
                        }>
                            <img src="/assets/icons/icons8-cv-100.png" alt="CV Icon" className="w-6 h-6" />
                            {isOpen && <span>Add Cv</span>}
                        </NavLink>
                    </li>

                    <li className="w-full rounded">
                        <NavLink to="project-submission" className={({isActive}) => 
                            `flex items-center gap-2 text-white ${
                                isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                            } ${!isOpen && 'md:justify-center'}`
                        }>
                            <img src="/assets/icons/icons8-add-project-100.png" alt="Project Icon" className="w-6 h-6" />
                            {isOpen && <span>Project submission</span>}
                        </NavLink>
                    </li>

                    <li className="w-full rounded">
                        <NavLink to="project-selection" className={({isActive}) => 
                            `flex items-center gap-2 text-white ${
                                isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                            } ${!isOpen && 'md:justify-center'}`
                        }>
                            <img src="/assets/icons/icons8-project-management-100.png" alt="Project Selection Icon" className="w-6 h-6" />
                            {isOpen && <span>Project selection</span>}
                        </NavLink>
                    </li>

                    <li className="w-full rounded">
                        <NavLink to="manage-account" className={({isActive}) => 
                            `flex items-center gap-2 text-white ${
                                isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                            } ${!isOpen && 'md:justify-center'}`
                        }>
                            <img src="/assets/icons/icons8-manage-account-100.png" alt="Manage Account Icon" className="w-6 h-6" />
                            {isOpen && <span>Manage account</span>}
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Navigation menu - bottom items (fixed at bottom) */}
            <ul className="w-full p-2">
                <li className="w-full rounded">
                    <NavLink to="setting" className={({isActive}) => 
                        `flex items-center gap-2 text-white ${
                            isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                        } ${!isOpen && 'md:justify-center'}`
                    }>
                        <img src="/assets/icons/icons8-setting-100.png" alt="Settings Icon" className="w-6 h-6" />
                        {isOpen && <span>Setting</span>}
                    </NavLink>
                </li>

                <li className="w-full rounded">
                    <NavLink to="logout" className={({isActive}) => 
                        `flex items-center gap-2 text-white ${
                            isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                        } ${!isOpen && 'md:justify-center'}`
                    }>
                        <img src="/assets/icons/icons8-log-out-100.png" alt="Logout Icon" className="w-6 h-6" />
                        {isOpen && <span>Logout</span>}
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}