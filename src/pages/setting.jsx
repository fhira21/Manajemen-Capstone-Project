import { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import dataDosen from '../data/dosen.json';
import dataMahasiswa from '../data/mahasiswa.json';
import dataMitra from '../data/mitra.json';
import dataUser from '../data/user.json';

export default function Settings() {
    const { user: authUser, loading: authLoading } = useAuth();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('pribadi');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (authLoading) return; // Wait for auth to complete
        
        setLoading(true);
        setErrorMessage('');
        
        // Get user info from auth context or localStorage
        let currentUserId;
        let role;
        
        if (authUser) {
            currentUserId = authUser.id;
            role = authUser.role;
        } else {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    currentUserId = userData.id;
                    role = userData.role;
                } else {
                    role = localStorage.getItem('userRole');
                }
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                setErrorMessage('Terjadi kesalahan saat memuat data pengguna.');
            }
        }

        // Default settings for all users
        const defaultSettings = {
            aktif: true,
            loginTerakhir: getCurrentDateTimeString(),
            aktivitas: 'Melihat halaman pengaturan',
            institusi: {
                institusi: '',
                fakultas: '',
                prodi: '',
                lokasi: '',
                jabatan: '',
                statusPegawai: '',
                noTelepon: '',
                alamat: '',
            }
        };
        
        // If no user ID found, use default profile
        if (!currentUserId) {
            setUser({
                nama: 'User Default',
                email: 'default@email.com',
                nip: '000000',
                role: role || 'Publik',
                username: 'userdefault',
                foto: 'https://i.pravatar.cc/100',
                aktif: false,
                loginTerakhir: getCurrentDateTimeString(),
                aktivitas: 'Melihat halaman pengaturan',
                institusi: { ...defaultSettings.institusi }
            });
            setLoading(false);
            return;
        }
        
        // Find the user data in the user.json file
        const userData = dataUser.USER.find(u => u.ID_User === currentUserId);
        
        if (!userData) {
            console.error('User data not found for ID:', currentUserId);
            setErrorMessage('Data pengguna tidak ditemukan.');
            setLoading(false);
            return;
        }

        // Set up user data based on role
        try {
            if (role === 'Dosen') {
                const dosen = dataDosen.DOSEN.find(d => d.ID_User === currentUserId);
                if (dosen) {
                    setUser({
                        ...defaultSettings,
                        nama: dosen.Nama,
                        email: userData.Email,
                        nip: dosen.NIP,
                        role: 'Dosen',
                        username: userData.Username,
                        foto: dosen.Foto_Profile || 'https://i.pravatar.cc/100',
                        institusi: {
                            ...defaultSettings.institusi,
                            noTelepon: dosen.No_Telepon || '',
                            institusi: 'Universitas Teknologi Digital',
                            fakultas: 'Fakultas Ilmu Komputer',
                            prodi: 'Teknik Informatika',
                        }
                    });
                } else {
                    throw new Error('Data dosen tidak ditemukan');
                }
            } else if (role === 'Mahasiswa') {
                const mahasiswa = dataMahasiswa.MAHASISWA.find(m => m.ID_User === currentUserId);
                if (mahasiswa) {
                    setUser({
                        ...defaultSettings,
                        nama: mahasiswa.Nama,
                        email: userData.Email,
                        nip: mahasiswa.NIM, // Use NIM for students
                        role: 'Mahasiswa',
                        username: userData.Username,
                        foto: mahasiswa.Foto_Profile || 'https://i.pravatar.cc/100',
                        institusi: {
                            ...defaultSettings.institusi,
                            institusi: 'Universitas Teknologi Digital',
                            fakultas: 'Fakultas Ilmu Komputer',
                            prodi: mahasiswa.Program_Studi || 'Teknik Informatika',
                            noTelepon: mahasiswa.No_Telepon || '',
                            alamat: mahasiswa.Alamat || ''
                        }
                    });
                } else {
                    throw new Error('Data mahasiswa tidak ditemukan');
                }
            } else if (role === 'Mitra') {
                const mitra = dataMitra.MITRA.find(m => m.ID_User === currentUserId);
                if (mitra) {
                    setUser({
                        ...defaultSettings,
                        nama: mitra.Nama_Perusahaan,
                        email: userData.Email,
                        nip: '', // Mitra doesn't have NIP/NIM
                        role: 'Mitra',
                        username: userData.Username,
                        foto: mitra.Foto_Profile || 'https://i.pravatar.cc/100',
                        institusi: {
                            ...defaultSettings.institusi,
                            institusi: mitra.Nama_Perusahaan,
                            lokasi: mitra.Alamat || '',
                            noTelepon: mitra.No_Telepon || '',
                            jabatan: 'Partner'
                        }
                    });
                } else {
                    throw new Error('Data mitra tidak ditemukan');
                }
            } else {
                // Default user data if role is unknown or user data is not found
                setUser({
                    ...defaultSettings,
                    nama: userData?.Username || 'User',
                    email: userData?.Email || 'user@example.com',
                    nip: '000000',
                    role: role || 'Publik',
                    username: userData?.Username || 'user',
                    foto: 'https://i.pravatar.cc/100'
                });
            }
        } catch (error) {
            console.error('Error setting up user data:', error);
            setErrorMessage(`Terjadi kesalahan: ${error.message}`);
            
            // Set default user data as fallback
            setUser({
                ...defaultSettings,
                nama: userData?.Username || 'User',
                email: userData?.Email || 'user@example.com',
                nip: '000000',
                role: role || 'Publik',
                username: userData?.Username || 'user',
                foto: 'https://i.pravatar.cc/100'
            });
        } finally {
            setLoading(false);
        }
    }, [authUser, authLoading]);
    
    // Helper function to get current date and time in the required format
    function getCurrentDateTimeString() {
        const now = new Date();
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        };
        return now.toLocaleDateString('id-ID', options) + ' WIB';
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleInstitusiChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            institusi: {
                ...user.institusi,
                [name]: value,
            },
        });
    };

    const toggleAktif = () => {
        setUser({ ...user, aktif: !user.aktif });
    };

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

    const handleSave = () => {
        setIsSaving(true);
        setSaveMessage({ type: '', text: '' });
        
        // Simulate saving data
        setTimeout(() => {
            try {
                // In a real app, this would send data to the server
                // For now, just update local storage
                const userToSave = { ...user };
                
                // Only update parts of localStorage that we can
                if (localStorage.getItem('user')) {
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    // Only update fields that are acceptable to change
                    const updatedUser = { 
                        ...storedUser,
                        nama: user.nama,
                        email: user.email
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
                
                setSaveMessage({ 
                    type: 'success', 
                    text: 'Perubahan berhasil disimpan!' 
                });
            } catch (error) {
                console.error('Error saving changes:', error);
                setSaveMessage({ 
                    type: 'error', 
                    text: 'Gagal menyimpan perubahan. Silakan coba lagi.' 
                });
            } finally {
                setIsSaving(false);
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    setSaveMessage({ type: '', text: '' });
                }, 5000);
            }
        }, 800); // Simulate network delay
    };

    if (loading || !user) {
        return (
            <>
                <PageTitle title="Kelola Akun" description="Pengaturan untuk pengguna" />
                <div className="bg-white p-4 sm:p-6 min-h-screen">
                    <div className="max-w-5xl mx-auto rounded-lg p-6 sm:p-8">
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-20 h-20 relative mb-6">
                                <div className="w-20 h-20 rounded-full border-4 border-blue-100"></div>
                                <div className="w-20 h-20 rounded-full border-t-4 border-blue-500 animate-spin absolute top-0 left-0"></div>
                            </div>
                            <p className="text-gray-700 font-medium text-lg">Memuat data pengguna...</p>
                            <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
    if (errorMessage) {
        return (
            <>
                <PageTitle title="Kelola Akun" description="Pengaturan untuk pengguna" />
                <div className="bg-white p-4 sm:p-6 min-h-screen">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 my-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-4 mb-5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
                            <p className="text-gray-600 mb-6">{errorMessage}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center justify-center bg-blue-600 text-white font-medium px-5 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageTitle title="Kelola Akun" description="Pengaturan untuk pengguna" />
            <div className="h-full  overflow-y-auto">
                <div className="  h-full overflow-y-auto mx-auto rounded-xl border p-6 sm:p-8">
                    {/* Tabs Sticky Bar */}
                    <div
                        className="w-full flex justify-center items-center p-1 100 rounded-xl mb-8"
                        style={{position: 'sticky', top: 0, background: 'bg-gray-100'}}
                    >
                        <div
                            className="flex flex-wrap sm:inline-flex rounded-lg  overflow-hidden bg-gray-100 p-1  w-full sm:w-auto"
                        >
                    <button
                        onClick={() => setActiveTab('pribadi')}
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none  ${
                            activeTab === 'pribadi'
                                ? ' bg-white p-0.5 shadow-sm rounded-md'
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        style={{ borderRight: '1px solid #e5e7eb' }}
                    >
                        Informasi Pribadi
                    </button>
                    <button
                        onClick={() => setActiveTab('institusi')}
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none  ${
                            activeTab === 'institusi'
                                ? ' bg-white p-0.5 shadow-sm rounded-md'
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        style={{ borderRight: '1px solid #e5e7eb' }}
                    >
                        Institusi
                    </button>
                    <button
                        onClick={() => setActiveTab('akun')}
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none  ${
                            activeTab === 'akun'
                                ? ' bg-white p-0.5 shadow-sm rounded-md'
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Pengaturan Akun
                    </button>
                </div>
            </div>

                    {activeTab === 'pribadi' && (
                        <div className="flex justify-center items-center  flex-col md:flex-row transition-opacity duration-300 ease-in-out">
                            <div className="flex flex-col items-center w-full md:w-1/3 mb-6 md:mb-0">
                                <div className="relative group">
                                <img 
                                    src={user.foto} 
                                    alt="Foto Profil" 
                                    className="
                                        w-32 h-32  // Default untuk mobile kecil
                                        sm:w-40 sm:h-40  // 640px ke atas
                                        md:w-48 md:h-48  // 768px ke atas
                                        lg:w-52 lg:h-52  // 1024px ke atas
                                        xl:w-56 xl:h-56  // 1280px ke atas
                                        2xl:w-60 2xl:h-60  // 1536px ke atas
                                        rounded-full 
                                        object-cover 
                                        border-2 
                                        border-gray-200 
                                        shadow-sm
                                    " 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://i.pravatar.cc/100';
                                    }}
                                />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="text-white text-sm font-medium px-3 py-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Ubah
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm font-medium text-gray-800">{user.role}</p>
                                <p className="text-xs text-gray-500">{user.username}</p>
                            </div>
                            <div className="w-full md:w-2/3">
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        name="nama" 
                                        value={user.nama} 
                                        onChange={handleInputChange} 
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{user.role === 'Mahasiswa' ? 'NIM' : 'NIDN / NIP'}</label>
                                        <input 
                                            type="text" 
                                            name="nip" 
                                            value={user.nip} 
                                            onChange={handleInputChange} 
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={user.email} 
                                            onChange={handleInputChange} 
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                        />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            name="role" 
                                            value={user.role} 
                                            disabled 
                                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-600" 
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mr-3">Status</label>
                                    <button 
                                        type="button"
                                        onClick={toggleAktif} 
                                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${user.aktif ? 'bg-green-500' : 'bg-gray-400'}`}
                                        role="switch"
                                        aria-checked={user.aktif}
                                    >
                                        <span 
                                            aria-hidden="true" 
                                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${user.aktif ? 'translate-x-5' : 'translate-x-0'}`} 
                                        />
                                    </button>
                                    <span className="ml-2 text-sm text-gray-700">{user.aktif ? 'Aktif' : 'Nonaktif'}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
                                    <button 
                                        type="button"
                                        className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Profil
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleSave} 
                                        disabled={isSaving}
                                        className={`flex items-center justify-center text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-300 ${
                                            isSaving 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                    >
                                        {isSaving && (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                                
                                {saveMessage.text && (
                                    <div className={`mt-4 p-3 rounded-md shadow-sm ${
                                        saveMessage.type === 'success' 
                                            ? 'bg-green-50 border border-green-200 text-green-800' 
                                            : 'bg-red-50 border border-red-200 text-red-800'
                                    }`}>
                                        <div className="flex items-center">
                                            {saveMessage.type === 'success' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {saveMessage.text}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Informasi Akun</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                                        <div>
                                            <span className="text-xs text-gray-500 block">Username</span>
                                            <span className="text-sm font-medium">{user.username}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block">Login Terakhir</span>
                                            <span className="text-sm font-medium">{user.loginTerakhir}</span>
                                        </div>
                                        <div className="md:col-span-2">
                                            <span className="text-xs text-gray-500 block">Aktivitas Terakhir</span>
                                            <span className="text-sm font-medium">{user.aktivitas}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'institusi' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 transition-opacity duration-300 ease-in-out">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Institusi</label>
                                <input 
                                    name="institusi" 
                                    value={user.institusi.institusi} 
                                    onChange={handleInstitusiChange} 
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{user.role === 'Mahasiswa' ? 'NIM' : 'NIDN / NIP'}</label>
                                <input 
                                    name="nip" 
                                    value={user.nip} 
                                    onChange={handleInputChange} 
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fakultas</label>
                                <input 
                                    name="fakultas" 
                                    value={user.institusi.fakultas} 
                                    onChange={handleInstitusiChange} 
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan {user.role === 'Mitra' ? '' : 'Akademik'}</label>
                                <div className="relative">
                                    <select 
                                        name="jabatan" 
                                        value={user.institusi.jabatan} 
                                        onChange={handleInstitusiChange} 
                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm appearance-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="">-- Pilih Jabatan --</option>
                                        {user.role === 'Dosen' ? (
                                            <>
                                                <option>Asisten Ahli</option>
                                                <option>Lektor</option>
                                                <option>Lektor Kepala</option>
                                                <option>Guru Besar</option>
                                            </>
                                        ) : user.role === 'Mitra' ? (
                                            <>
                                                <option>Partner</option>
                                                <option>Manager</option>
                                                <option>Director</option>
                                            </>
                                        ) : (
                                            <>
                                                <option>Asisten Lab</option>
                                                <option>Ketua Kelas</option>
                                            </>
                                        )}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                                <input 
                                    name="prodi" 
                                    value={user.institusi.prodi} 
                                    onChange={handleInstitusiChange} 
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status {user.role === 'Mitra' ? 'Perusahaan' : 'Pegawai'}</label>
                                <div className="relative">
                                    <select 
                                        name="statusPegawai" 
                                        value={user.institusi.statusPegawai} 
                                        onChange={handleInstitusiChange} 
                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm appearance-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="">-- Pilih Status --</option>
                                        {user.role === 'Mitra' ? (
                                            <>
                                                <option>Swasta</option>
                                                <option>BUMN</option>
                                                <option>Startup</option>
                                            </>
                                        ) : (
                                            <>
                                                <option>Kontrak</option>
                                                <option>Tetap</option>
                                            </>
                                        )}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{user.role === 'Mitra' ? 'Alamat Kantor' : 'Lokasi Kampus'}</label>
                                <input 
                                    name="lokasi" 
                                    value={user.institusi.lokasi} 
                                    onChange={handleInstitusiChange} 
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                <input 
                                    name="noTelepon" 
                                    value={user.institusi.noTelepon} 
                                    onChange={handleInstitusiChange} 
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                />
                            </div>
                            <div className="col-span-2 mt-8 pt-6 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                                    <button 
                                        type="button"
                                        className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Informasi
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleSave} 
                                        disabled={isSaving}
                                        className={`flex items-center justify-center text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-300 ${
                                            isSaving 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                    >
                                        {isSaving && (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                                
                                {saveMessage.text && (
                                    <div className={`mt-4 p-3 rounded-md shadow-sm ${
                                        saveMessage.type === 'success' 
                                            ? 'bg-green-50 border border-green-200 text-green-800' 
                                            : 'bg-red-50 border border-red-200 text-red-800'
                                    }`}>
                                        <div className="flex items-center">
                                            {saveMessage.type === 'success' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {saveMessage.text}
                                        </div>
                                    </div>
                                )}
                                
                                {user.role === 'Dosen' && (
                                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-800">
                                        <div className="flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <p>Data institusi yang Anda masukkan akan digunakan untuk keperluan administratif capstone project. Pastikan informasi yang diisi sudah benar.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'akun' && (
                        <div className="transition-opacity duration-300 ease-in-out">
                            <div className="mb-8">
                                <h3 className="text-md font-medium mb-4 text-gray-800 pb-2 border-b border-gray-200">Informasi Login</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input 
                                                type="text" 
                                                name="username" 
                                                value={user.username} 
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md pl-10 px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={user.email} 
                                                onChange={handleInputChange} 
                                                className="w-full border border-gray-300 rounded-md pl-10 px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-md font-medium mb-4 text-gray-800 pb-2 border-b border-gray-200">Ubah Password</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input 
                                                type="password"
                                                placeholder="Masukkan password lama"
                                                className="w-full border border-gray-300 rounded-md pl-10 px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input 
                                                    type="password"
                                                    placeholder="Masukkan password baru"
                                                    className="w-full border border-gray-300 rounded-md pl-10 px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input 
                                                    type="password"
                                                    placeholder="Konfirmasi password baru"
                                                    className="w-full border border-gray-300 rounded-md pl-10 px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h3 className="text-md font-medium mb-4 text-gray-800 pb-2 border-b border-gray-200">Pengaturan Notifikasi</h3>
                                <div className="bg-white rounded-md divide-y divide-gray-100">
                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Email notifikasi</h4>
                                            <p className="text-xs text-gray-500">Dapatkan notifikasi melalui email</p>
                                        </div>
                                        <button 
                                            type="button"
                                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 translate-x-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Notifikasi aplikasi</h4>
                                            <p className="text-xs text-gray-500">Dapatkan notifikasi langsung di aplikasi</p>
                                        </div>
                                        <button 
                                            type="button"
                                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 translate-x-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h3 className="text-md font-medium mb-4 text-gray-800 pb-2 border-b border-gray-200">Keamanan Akun</h3>
                                <div className="bg-white rounded-md divide-y divide-gray-100">
                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Verifikasi 2 langkah</h4>
                                            <p className="text-xs text-gray-500">Aktifkan verifikasi tambahan saat login</p>
                                        </div>
                                        <button 
                                            type="button"
                                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Notifikasi login perangkat baru</h4>
                                            <p className="text-xs text-gray-500">Dapatkan notifikasi jika ada login dari perangkat baru</p>
                                        </div>
                                        <button 
                                            type="button"
                                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 translate-x-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                                <button 
                                    type="button" 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSaving && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                </button>
                                <button 
                                    type="button"
                                    className="flex items-center justify-center border border-red-500 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2.5 rounded-md transition-colors focus:outline-none focus:ring-4 focus:ring-red-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Reset Password
                                </button>
                            </div>
                            
                            {saveMessage.text && (
                                <div className={`mt-4 p-3 rounded-md shadow-sm ${
                                    saveMessage.type === 'success' 
                                        ? 'bg-green-50 border border-green-200 text-green-800' 
                                        : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                    <div className="flex items-center">
                                        {saveMessage.type === 'success' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {saveMessage.text}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
