import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <div className="w-full h-screen flex flex-col justify-around bg-primary  overflow-hidden">
            
            <div className={`m-5 border-b-2 p-4 flex flex-col justify-center items-center gap-2 ${!isOpen && 'md:items-center'}`}>
                <img src="/assets/logo.png" alt="Logo" className={`${isOpen ? 'w-20 h-20' : 'w-8 h-8'} transition-all duration-300`} />
                {isOpen && <h1 className="text-white text-xl text-center font-bold">Manajemen Capstone</h1>}
            </div>
        
            <ul className="text-sm p-3 flex flex-col gap-2">
                <li className="w-full rounded">
                    <NavLink to="/dasboard" className={({isActive}) => 
                        `flex items-center gap-2 text-white ${
                            isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                        } ${!isOpen && 'md:justify-center'}`
                    }>
                        <img src="/assets/icons/icons8-home-100.png" alt="Dashboard Icon" className="w-6 h-6" />
                        {isOpen && <span>Dashboard</span>}
                    </NavLink>
                </li>

                <li className="w-full rounded">
                    <NavLink to="/add-curriculum-vitae" className={({isActive}) => 
                        `flex items-center gap-2 text-white ${
                            isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                        } ${!isOpen && 'md:justify-center'}`
                    }>
                        <img src="/assets/icons/icons8-cv-100.png" alt="CV Icon" className="w-6 h-6" />
                        {isOpen && <span>Add Cv</span>}
                    </NavLink>
                </li>

                <li className="w-full rounded">
                    <NavLink to="/project-submission" className={({isActive}) => 
                        `flex items-center gap-2 text-white ${
                            isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                        } ${!isOpen && 'md:justify-center'}`
                    }>
                        <img src="/assets/icons/icons8-add-project-100.png" alt="Project Icon" className="w-6 h-6" />
                        {isOpen && <span>Project submission</span>}
                    </NavLink>
                </li>

                <li className="w-full rounded">
                    <NavLink to="/project-selection" className={({isActive}) => 
                        `flex items-center gap-2 text-white ${
                            isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                        } ${!isOpen && 'md:justify-center'}`
                    }>
                        <img src="/assets/icons/icons8-project-management-100.png" alt="Project Selection Icon" className="w-6 h-6" />
                        {isOpen && <span>Project selection</span>}
                    </NavLink>
                </li>

                <li className="w-full rounded">
                    <NavLink to="/manage-account" className={({isActive}) => 
                        `flex items-center gap-2 text-white ${
                            isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                        } ${!isOpen && 'md:justify-center'}`
                    }>
                        <img src="/assets/icons/icons8-manage-account-100.png" alt="Manage Account Icon" className="w-6 h-6" />
                        {isOpen && <span>Manage account</span>}
                    </NavLink>
                </li>
            </ul>

            <ul className="p-3 text-sm flex flex-col gap-2">
                <li className="w-full rounded">
                    <NavLink to="/setting" className={({isActive}) => 
                        `flex items-center gap-2 text-white ${
                            isActive ? 'bg-secondary font-bold p-2 rounded' : 'hover:bg-secondary p-2 rounded'
                        } ${!isOpen && 'md:justify-center'}`
                    }>
                        <img src="/assets/icons/icons8-setting-100.png" alt="Settings Icon" className="w-6 h-6" />
                        {isOpen && <span>Setting</span>}
                    </NavLink>
                </li>

                <li className="w-full rounded">
                    <NavLink to="/logout" className={({isActive}) => 
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