import { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import dataDosen from '../data/dosen.json';

export default function Settings() {
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('pribadi');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        const currentUserId = 'USR002'; // ganti jika ada login logic

        if (role === 'Dosen') {
            const dosen = dataDosen.DOSEN.find(d => d.ID_User === currentUserId);
            if (dosen) {
                setUser({
                    nama: dosen.Nama,
                    email: 'Farid@gmail.com',
                    nip: '123456',
                    role: 'Dosen',
                    username: 'faridsurya',
                    foto: dosen.Foto_Profile,
                    aktif: true,
                    loginTerakhir: '27 Juni 2025, 14:25 WIB',
                    aktivitas: 'Memeriksa progress mahasiswa',
                    institusi: {
                        institusi: '',
                        fakultas: '',
                        prodi: '',
                        lokasi: '',
                        jabatan: '',
                        statusPegawai: '',
                        noTelepon: '',
                    }
                });
            }
        } else {
            setUser({
                nama: 'User Default',
                email: 'default@email.com',
                nip: '000000',
                role: role || 'Publik',
                username: 'userdefault',
                foto: 'https://i.pravatar.cc/100',
                aktif: false,
                loginTerakhir: '1 Juli 2025, 10:00 WIB',
                aktivitas: 'Melihat halaman pengaturan',
                institusi: {
                    institusi: '',
                    fakultas: '',
                    prodi: '',
                    lokasi: '',
                    jabatan: '',
                    statusPegawai: '',
                    noTelepon: '',
                }
            });
        }
    }, []);

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

    const handleSave = () => {
        alert('Perubahan berhasil disimpan!');
    };

    if (!user) return <p className="p-6">Loading...</p>;

    return (
        <>
            <PageTitle title="Kelola Akun" description="Pengaturan untuk pengguna" />
            <div className="bg-white px-4 py-6 min-h-screen">
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow px-10 py-8">
                    {/* Tabs */}
                    <div className="flex space-x-8 border-b text-sm font-medium text-gray-600 mb-8">
                        <button onClick={() => setActiveTab('pribadi')} className={`pb-2 transition-all duration-300 ease-in-out ${activeTab === 'pribadi' ? 'border-b-2 border-blue-500 text-black' : ''}`}>Informasi Pribadi</button>
                        <button onClick={() => setActiveTab('institusi')} className={`pb-2 transition-all duration-300 ease-in-out ${activeTab === 'institusi' ? 'border-b-2 border-blue-500 text-black' : ''}`}>Institusi</button>
                        <button onClick={() => setActiveTab('akun')} className={`pb-2 transition-all duration-300 ease-in-out ${activeTab === 'akun' ? 'border-b-2 border-blue-500 text-black' : ''}`}>Pengaturan Akun</button>
                    </div>

                    {activeTab === 'pribadi' && (
                        <div className="flex flex-col md:flex-row transition-opacity duration-300 ease-in-out">
                            <div className="flex flex-col items-center w-full md:w-1/3 mb-6 md:mb-0">
                                <img src={user.foto} alt="Foto Profil" className="w-24 h-24 rounded-full object-cover border mb-2" />
                                <button className="text-sm text-gray-600 border px-3 py-1 rounded-md">Ubah Foto</button>
                            </div>
                            <div className="w-full md:w-2/3">
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Nama Lengkap</label>
                                    <input type="text" name="nama" value={user.nama} onChange={handleInputChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm text-gray-700">NIDN / NIP</label>
                                        <input type="text" name="nip" value={user.nip} onChange={handleInputChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-700">Email</label>
                                        <input type="email" name="email" value={user.email} onChange={handleInputChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Role</label>
                                    <input type="text" name="role" value={user.role} disabled className="mt-1 w-full border rounded-md px-3 py-2 text-sm bg-gray-100" />
                                </div>
                                <div className="flex items-center space-x-2 mt-4">
                                    <label className="text-sm text-gray-700">Status</label>
                                    <div onClick={toggleAktif} className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer ${user.aktif ? 'bg-green-500' : 'bg-gray-400'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transform ${user.aktif ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className="text-sm text-gray-700">{user.aktif ? 'Aktif' : 'Nonaktif'}</span>
                                </div>
                                <div className="flex space-x-4 mt-6">
                                    <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md">Edit Profil</button>
                                    <button onClick={handleSave} className="bg-gray-200 text-sm px-4 py-2 rounded-md">Simpan Perubahan</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 text-sm text-gray-700">
                                    <p>Username: {user.username}</p>
                                    <p>Aktivitas Terakhir: {user.aktivitas}</p>
                                    <p>Login Terakhir: {user.loginTerakhir}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'institusi' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ease-in-out">
                            <div>
                                <label className="text-sm text-gray-700">Nama Institusi</label>
                                <input name="institusi" value={user.institusi.institusi} onChange={handleInstitusiChange} className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">NIDN / NIP</label>
                                <input name="nip" value={user.nip} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Fakultas</label>
                                <input name="fakultas" value={user.institusi.fakultas} onChange={handleInstitusiChange} className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Jabatan Akademik</label>
                                <select name="jabatan" value={user.institusi.jabatan} onChange={handleInstitusiChange} className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                                    <option value="">-- Pilih Jabatan --</option>
                                    <option>Asisten Ahli</option>
                                    <option>Lektor</option>
                                    <option>Lektor Kepala</option>
                                    <option>Guru Besar</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Program Studi</label>
                                <input name="prodi" value={user.institusi.prodi} onChange={handleInstitusiChange} className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Status Pegawai</label>
                                <select name="statusPegawai" value={user.institusi.statusPegawai} onChange={handleInstitusiChange} className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                                    <option value="">-- Pilih Status --</option>
                                    <option>Kontrak</option>
                                    <option>Tetap</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Lokasi Kampus</label>
                                <input name="lokasi" value={user.institusi.lokasi} onChange={handleInstitusiChange} className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">No. Telepone</label>
                                <input name="noTelepon" value={user.institusi.noTelepon} onChange={handleInstitusiChange} className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                            </div>
                            <div className="col-span-2 flex space-x-4 mt-6">
                                <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md">Edit Informasi</button>
                                <button onClick={handleSave} className="bg-gray-200 text-sm px-4 py-2 rounded-md">Simpan Perubahan</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
