// ====================================================
// LOCALSTORAGE UTILITY - MANAJEMEN DATA CAPSTONE PROJECT
// ====================================================
// File utilitas untuk mengelola semua data aplikasi menggunakan localStorage
// 
// DESKRIPSI:
// File ini menyediakan fungsi-fungsi lengkap untuk operasi CRUD (Create, Read, Update, Delete)
// pada semua jenis data dalam sistem manajemen capstone project. Semua data disimpan di
// localStorage browser untuk persistensi data.
//
// JENIS DATA YANG DIDUKUNG:
// - USER: Data pengguna (mahasiswa, dosen, mitra)
// - MAHASISWA: Data khusus mahasiswa
// - DOSEN: Data dosen pembimbing  
// - MITRA: Data mitra industri
// - PROPOSAL: Data proposal project
// - PROJECT: Data project yang sedang berjalan
// - CV_MAHASISWA: Data CV mahasiswa
// - ISSUE: Data issue/masalah dalam project
// - COMMIT: Data commit Git
//
// CARA MENGGUNAKAN:
// 1. Import fungsi yang dibutuhkan:
//    import { getUsers, addUser, updateUser } from './localStorage.js';
//
// 2. Gunakan fungsi sesuai kebutuhan:
//    const users = getUsers();                    // Ambil semua user
//    addUser({ID_User: "USR001", ...});          // Tambah user baru
//    updateUser("USR001", {Nama: "New Name"});   // Update user
//
// 3. Untuk autentikasi:
//    import { authenticateUser, setCurrentUser } from './localStorage.js';
//    const user = authenticateUser("username", "password");
//    if (user) setCurrentUser(user);
//
// CATATAN PENTING:
// - Semua data disimpan sebagai array JSON di localStorage
// - Setiap fungsi memiliki error handling untuk mencegah crash aplikasi
// - Data otomatis di-parse dari/ke JSON format
// - Gunakan ID yang unik untuk setiap data (ID_User, ID_Mahasiswa, dll.)
//
// ====================================================

// Kunci-kunci untuk localStorage
// Keys for localStorage
const STORAGE_KEYS = {
  COMMIT: 'COMMIT',           // Data commit Git
  CV_MAHASISWA: 'CV_Mahasiswa', // Data CV mahasiswa
  DOSEN: 'DOSEN',            // Data dosen/pembimbing
  ISSUE: 'ISSUE',            // Data issue/masalah
  MAHASISWA: 'MAHASISWA',    // Data mahasiswa
  MITRA: 'MITRA',            // Data mitra industri
  PROJECT: 'PROJECT',        // Data project
  PROPOSAL: 'PROPOSAL',      // Data proposal project
  USER: 'USER'               // Data user/pengguna
};

// ====================================================
// FUNGSI-FUNGSI GENERIC UNTUK LOCALSTORAGE
// Generic localStorage functions
// ====================================================

/**
 * Mengambil data dari localStorage berdasarkan key
 * Fungsi ini adalah dasar untuk semua operasi GET data
 * 
 * @param {string} key - Kunci localStorage
 * @returns {Array} Array data atau array kosong jika tidak ada data
 * 
 * Contoh penggunaan:
 * const users = getFromStorage('USER');
 * const mahasiswa = getFromStorage('MAHASISWA');
 */
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return [];
  }
};

/**
 * Menyimpan data ke localStorage
 * Fungsi ini adalah dasar untuk semua operasi SAVE data
 * 
 * @param {string} key - Kunci localStorage
 * @param {Array|Object} data - Data yang akan disimpan
 * @returns {boolean} True jika berhasil, false jika gagal
 * 
 * Contoh penggunaan:
 * saveToStorage('USER', userArray);
 * saveToStorage('MAHASISWA', mahasiswaArray);
 */
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

/**
 * Menghapus data dari localStorage
 * Menghapus seluruh key dan datanya dari localStorage
 * 
 * @param {string} key - Kunci localStorage yang akan dihapus
 * @returns {boolean} True jika berhasil, false jika gagal
 * 
 * Contoh penggunaan:
 * clearStorage('USER');        // Hapus semua data user
 * clearStorage('MAHASISWA');   // Hapus semua data mahasiswa
 */
const clearStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error clearing ${key} from localStorage:`, error);
    return false;
  }
};

// ====================================================
// FUNGSI-FUNGSI UNTUK MENGELOLA DATA COMMIT
// COMMIT Functions
// ====================================================

/**
 * Mengambil semua data commit dari localStorage
 * Cara pakai: const commits = getCommits();
 */
export const getCommits = () => getFromStorage(STORAGE_KEYS.COMMIT);

/**
 * Menyimpan array commit ke localStorage
 * Cara pakai: saveCommits([{commit1}, {commit2}]);
 */
export const saveCommits = (commits) => saveToStorage(STORAGE_KEYS.COMMIT, commits);

/**
 * Menambah commit baru ke localStorage
 * Cara pakai: addCommit({ID_Commit: "C001", message: "Initial commit"});
 */
export const addCommit = (commit) => {
  const commits = getCommits();
  commits.push(commit);
  return saveCommits(commits);
};

/**
 * Mengupdate commit berdasarkan ID
 * Cara pakai: updateCommit("C001", {message: "Updated commit message"});
 */
export const updateCommit = (id, updatedCommit) => {
  const commits = getCommits();
  const index = commits.findIndex(commit => commit.ID_Commit === id);
  if (index !== -1) {
    commits[index] = { ...commits[index], ...updatedCommit };
    return saveCommits(commits);
  }
  return false;
};

/**
 * Menghapus commit berdasarkan ID
 * Cara pakai: deleteCommit("C001");
 */
export const deleteCommit = (id) => {
  const commits = getCommits();
  const filteredCommits = commits.filter(commit => commit.ID_Commit !== id);
  return saveCommits(filteredCommits);
};

/**
 * Mencari commit berdasarkan ID
 * Cara pakai: const commit = getCommitById("C001");
 */
export const getCommitById = (id) => {
  const commits = getCommits();
  return commits.find(commit => commit.ID_Commit === id);
};

// ====================================================
// FUNGSI-FUNGSI UNTUK MENGELOLA DATA CV MAHASISWA
// CV Mahasiswa Functions
// ====================================================

/**
 * Mengambil semua data CV mahasiswa dari localStorage
 * Cara pakai: const cvList = getCVMahasiswa();
 */
export const getCVMahasiswa = () => getFromStorage(STORAGE_KEYS.CV_MAHASISWA);

/**
 * Menyimpan array CV mahasiswa ke localStorage
 * Cara pakai: saveCVMahasiswa([{cv1}, {cv2}]);
 */
export const saveCVMahasiswa = (cvData) => saveToStorage(STORAGE_KEYS.CV_MAHASISWA, cvData);

/**
 * Menambah CV mahasiswa baru ke localStorage
 * Cara pakai: addCVMahasiswa({ID_CV: "CV001", Nama: "John Doe", ...});
 */
export const addCVMahasiswa = (cv) => {
  const cvList = getCVMahasiswa();
  cvList.push(cv);
  return saveCVMahasiswa(cvList);
};

/**
 * Mengupdate CV mahasiswa berdasarkan ID
 * Cara pakai: updateCVMahasiswa("CV001", {Nama: "Jane Doe"});
 */
export const updateCVMahasiswa = (id, updatedCV) => {
  const cvList = getCVMahasiswa();
  const index = cvList.findIndex(cv => cv.ID_CV === id);
  if (index !== -1) {
    cvList[index] = { ...cvList[index], ...updatedCV };
    return saveCVMahasiswa(cvList);
  }
  return false;
};

/**
 * Menghapus CV mahasiswa berdasarkan ID
 * Cara pakai: deleteCVMahasiswa("CV001");
 */
export const deleteCVMahasiswa = (id) => {
  const cvList = getCVMahasiswa();
  const filteredCV = cvList.filter(cv => cv.ID_CV !== id);
  return saveCVMahasiswa(filteredCV);
};

/**
 * Mencari CV mahasiswa berdasarkan ID
 * Cara pakai: const cv = getCVMahasiswaById("CV001");
 */
export const getCVMahasiswaById = (id) => {
  const cvList = getCVMahasiswa();
  return cvList.find(cv => cv.ID_CV === id);
};

// ====================================================
// FUNGSI-FUNGSI UNTUK MENGELOLA DATA DOSEN
// DOSEN Functions
// ====================================================

/**
 * Mengambil semua data dosen dari localStorage
 * Cara pakai: const dosenList = getDosen();
 */
export const getDosen = () => getFromStorage(STORAGE_KEYS.DOSEN);

/**
 * Menyimpan array dosen ke localStorage
 * Cara pakai: saveDosen([{dosen1}, {dosen2}]);
 */
export const saveDosen = (dosenData) => saveToStorage(STORAGE_KEYS.DOSEN, dosenData);

/**
 * Menambah dosen baru ke localStorage
 * Cara pakai: addDosen({ID_Dosen: "D001", Nama: "Dr. John", ...});
 */
export const addDosen = (dosen) => {
  const dosenList = getDosen();
  dosenList.push(dosen);
  return saveDosen(dosenList);
};

/**
 * Mengupdate data dosen berdasarkan ID
 * Cara pakai: updateDosen("D001", {Nama: "Dr. Jane"});
 */
export const updateDosen = (id, updatedDosen) => {
  const dosenList = getDosen();
  const index = dosenList.findIndex(dosen => dosen.ID_Dosen === id);
  if (index !== -1) {
    dosenList[index] = { ...dosenList[index], ...updatedDosen };
    return saveDosen(dosenList);
  }
  return false;
};

/**
 * Menghapus dosen berdasarkan ID
 * Cara pakai: deleteDosen("D001");
 */
export const deleteDosen = (id) => {
  const dosenList = getDosen();
  const filteredDosen = dosenList.filter(dosen => dosen.ID_Dosen !== id);
  return saveDosen(filteredDosen);
};

/**
 * Mencari dosen berdasarkan ID
 * Cara pakai: const dosen = getDosenById("D001");
 */
export const getDosenById = (id) => {
  const dosenList = getDosen();
  return dosenList.find(dosen => dosen.ID_Dosen === id);
};

// ====================================================
// FUNGSI-FUNGSI UNTUK MENGELOLA DATA ISSUE
// ISSUE Functions
// ====================================================

/**
 * Mengambil semua data issue dari localStorage
 * Cara pakai: const issues = getIssues();
 */
export const getIssues = () => getFromStorage(STORAGE_KEYS.ISSUE);

/**
 * Menyimpan array issue ke localStorage
 * Cara pakai: saveIssues([{issue1}, {issue2}]);
 */
export const saveIssues = (issueData) => saveToStorage(STORAGE_KEYS.ISSUE, issueData);

/**
 * Menambah issue baru ke localStorage
 * Cara pakai: addIssue({ID_Issue: "I001", title: "Bug Report", ...});
 */
export const addIssue = (issue) => {
  const issues = getIssues();
  issues.push(issue);
  return saveIssues(issues);
};

/**
 * Mengupdate issue berdasarkan ID
 * Cara pakai: updateIssue("I001", {status: "resolved"});
 */
export const updateIssue = (id, updatedIssue) => {
  const issues = getIssues();
  const index = issues.findIndex(issue => issue.ID_Issue === id);
  if (index !== -1) {
    issues[index] = { ...issues[index], ...updatedIssue };
    return saveIssues(issues);
  }
  return false;
};

/**
 * Menghapus issue berdasarkan ID
 * Cara pakai: deleteIssue("I001");
 */
export const deleteIssue = (id) => {
  const issues = getIssues();
  const filteredIssues = issues.filter(issue => issue.ID_Issue !== id);
  return saveIssues(filteredIssues);
};

/**
 * Mencari issue berdasarkan ID
 * Cara pakai: const issue = getIssueById("I001");
 */
export const getIssueById = (id) => {
  const issues = getIssues();
  return issues.find(issue => issue.ID_Issue === id);
};

// ====================================================
// FUNGSI-FUNGSI UNTUK MENGELOLA DATA MAHASISWA
// MAHASISWA Functions
// ====================================================

/**
 * Mengambil semua data mahasiswa dari localStorage
 * Cara pakai: const mahasiswaList = getMahasiswa();
 */
export const getMahasiswa = () => getFromStorage(STORAGE_KEYS.MAHASISWA);

/**
 * Menyimpan array mahasiswa ke localStorage
 * Cara pakai: saveMahasiswa([{mahasiswa1}, {mahasiswa2}]);
 */
export const saveMahasiswa = (mahasiswaData) => saveToStorage(STORAGE_KEYS.MAHASISWA, mahasiswaData);

/**
 * Menambah mahasiswa baru ke localStorage
 * Cara pakai: addMahasiswa({ID_Mahasiswa: "MHS001", Nama: "John Doe", ...});
 */
export const addMahasiswa = (mahasiswa) => {
  const mahasiswaList = getMahasiswa();
  mahasiswaList.push(mahasiswa);
  return saveMahasiswa(mahasiswaList);
};

/**
 * Mengupdate data mahasiswa berdasarkan ID
 * Cara pakai: updateMahasiswa("MHS001", {Nama: "Jane Doe"});
 */
export const updateMahasiswa = (id, updatedMahasiswa) => {
  const mahasiswaList = getMahasiswa();
  const index = mahasiswaList.findIndex(mhs => mhs.ID_Mahasiswa === id);
  if (index !== -1) {
    mahasiswaList[index] = { ...mahasiswaList[index], ...updatedMahasiswa };
    return saveMahasiswa(mahasiswaList);
  }
  return false;
};

/**
 * Menghapus mahasiswa berdasarkan ID
 * Cara pakai: deleteMahasiswa("MHS001");
 */
export const deleteMahasiswa = (id) => {
  const mahasiswaList = getMahasiswa();
  const filteredMahasiswa = mahasiswaList.filter(mhs => mhs.ID_Mahasiswa !== id);
  return saveMahasiswa(filteredMahasiswa);
};

/**
 * Mencari mahasiswa berdasarkan ID
 * Cara pakai: const mahasiswa = getMahasiswaById("MHS001");
 */
export const getMahasiswaById = (id) => {
  const mahasiswaList = getMahasiswa();
  return mahasiswaList.find(mhs => mhs.ID_Mahasiswa === id);
};

// ====================================================
// FUNGSI-FUNGSI UNTUK MENGELOLA DATA MITRA
// MITRA Functions
// ====================================================

/**
 * Mengambil semua data mitra dari localStorage
 * Cara pakai: const mitraList = getMitra();
 */
export const getMitra = () => getFromStorage(STORAGE_KEYS.MITRA);

/**
 * Menyimpan array mitra ke localStorage
 * Cara pakai: saveMitra([{mitra1}, {mitra2}]);
 */
export const saveMitra = (mitraData) => saveToStorage(STORAGE_KEYS.MITRA, mitraData);

/**
 * Menambah mitra baru ke localStorage
 * Cara pakai: addMitra({ID_Mitra: "MIT001", Nama_Perusahaan: "PT ABC", ...});
 */
export const addMitra = (mitra) => {
  const mitraList = getMitra();
  mitraList.push(mitra);
  return saveMitra(mitraList);
};

/**
 * Mengupdate data mitra berdasarkan ID
 * Cara pakai: updateMitra("MIT001", {Nama_Perusahaan: "PT XYZ"});
 */
export const updateMitra = (id, updatedMitra) => {
  const mitraList = getMitra();
  const index = mitraList.findIndex(mitra => mitra.ID_Mitra === id);
  if (index !== -1) {
    mitraList[index] = { ...mitraList[index], ...updatedMitra };
    return saveMitra(mitraList);
  }
  return false;
};

/**
 * Menghapus mitra berdasarkan ID
 * Cara pakai: deleteMitra("MIT001");
 */
export const deleteMitra = (id) => {
  const mitraList = getMitra();
  const filteredMitra = mitraList.filter(mitra => mitra.ID_Mitra !== id);
  return saveMitra(filteredMitra);
};

/**
 * Mencari mitra berdasarkan ID
 * Cara pakai: const mitra = getMitraById("MIT001");
 */
export const getMitraById = (id) => {
  const mitraList = getMitra();
  return mitraList.find(mitra => mitra.ID_Mitra === id);
};

// ====================================================
// FUNGSI-FUNGSI UNTUK MENGELOLA DATA PROJECT
// PROJECT Functions
// ====================================================

/**
 * Mengambil semua data project dari localStorage
 * Cara pakai: const projects = getProjects();
 */
export const getProjects = () => getFromStorage(STORAGE_KEYS.PROJECT);

/**
 * Menyimpan array project ke localStorage
 * Cara pakai: saveProjects([{project1}, {project2}]);
 */
export const saveProjects = (projectData) => saveToStorage(STORAGE_KEYS.PROJECT, projectData);

/**
 * Menambah project baru ke localStorage
 * Cara pakai: addProject({ID_Project: "PRJ001", Nama_Project: "Website E-commerce", ...});
 */
export const addProject = (project) => {
  const projects = getProjects();
  projects.push(project);
  return saveProjects(projects);
};

/**
 * Mengupdate project berdasarkan ID
 * Cara pakai: updateProject("PRJ001", {status: "completed"});
 */
export const updateProject = (id, updatedProject) => {
  const projects = getProjects();
  const index = projects.findIndex(project => project.ID_Project === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updatedProject };
    return saveProjects(projects);
  }
  return false;
};

/**
 * Menghapus project berdasarkan ID
 * Cara pakai: deleteProject("PRJ001");
 */
export const deleteProject = (id) => {
  const projects = getProjects();
  const filteredProjects = projects.filter(project => project.ID_Project !== id);
  return saveProjects(filteredProjects);
};

/**
 * Mencari project berdasarkan ID
 * Cara pakai: const project = getProjectById("PRJ001");
 */
export const getProjectById = (id) => {
  const projects = getProjects();
  return projects.find(project => project.ID_Project === id);
};

// ====================================================
// FUNGSI-FUNGSI UNTUK MENGELOLA DATA PROPOSAL
// PROPOSAL Functions
// ====================================================

/**
 * Mengambil semua data proposal dari localStorage
 * Cara pakai: const proposals = getProposals();
 */
export const getProposals = () => getFromStorage(STORAGE_KEYS.PROPOSAL);

/**
 * Menyimpan array proposal ke localStorage
 * Cara pakai: saveProposals([{proposal1}, {proposal2}]);
 */
export const saveProposals = (proposalData) => saveToStorage(STORAGE_KEYS.PROPOSAL, proposalData);

/**
 * Menambah proposal baru ke localStorage
 * Cara pakai: addProposal({ID_Proposal: "PRP001", judul: "Sistem Manajemen", ...});
 */
export const addProposal = (proposal) => {
  const proposals = getProposals();
  proposals.push(proposal);
  return saveProposals(proposals);
};

/**
 * Mengupdate proposal berdasarkan ID
 * Cara pakai: updateProposal("PRP001", {status: "approved"});
 */
export const updateProposal = (id, updatedProposal) => {
  const proposals = getProposals();
  const index = proposals.findIndex(proposal => proposal.ID_Proposal === id);
  if (index !== -1) {
    proposals[index] = { ...proposals[index], ...updatedProposal };
    return saveProposals(proposals);
  }
  return false;
};

/**
 * Menghapus proposal berdasarkan ID
 * Cara pakai: deleteProposal("PRP001");
 */
export const deleteProposal = (id) => {
  const proposals = getProposals();
  const filteredProposals = proposals.filter(proposal => proposal.ID_Proposal !== id);
  return saveProposals(filteredProposals);
};

/**
 * Mencari proposal berdasarkan ID
 * Cara pakai: const proposal = getProposalById("PRP001");
 */
export const getProposalById = (id) => {
  const proposals = getProposals();
  return proposals.find(proposal => proposal.ID_Proposal === id);
};

/**
 * Menambah komentar dosen ke proposal berdasarkan ID
 * Cara pakai: addKomentarDosen("PRP001", "Komentar dosen tentang proposal ini");
 */
export const addKomentarDosen = (id, komentar) => {
  const proposals = getProposals();
  const index = proposals.findIndex(proposal => proposal.ID_Proposal === id);
  if (index !== -1) {
    // Inisialisasi array komentarDosen jika belum ada
    if (!proposals[index].komentarDosen) {
      proposals[index].komentarDosen = [];
    }
    
    // Tambah komentar baru dengan timestamp
    const newKomentar = {
      id: Date.now().toString(),
      komentar: komentar,
      tanggal: new Date().toLocaleDateString('id-ID'),
      timestamp: new Date().toISOString()
    };
    
    proposals[index].komentarDosen.push(newKomentar);
    return saveProposals(proposals);
  }
  return false;
};


/**
 * Mengambil semua data user dari localStorage
 * 
 * Cara pakai: 
 * const users = getUsers();
 * console.log(users); // Array berisi semua data user
 * 
 * @returns {Array} Array berisi semua data user
 */
export const getUsers = () => getFromStorage(STORAGE_KEYS.USER);

/**
 * Menyimpan array user ke localStorage
 * PENTING: Fungsi ini akan menimpa seluruh data user yang ada
 * 
 * Cara pakai: 
 * const newUsers = [{ID_User: "USR001", Username: "john"}, {ID_User: "USR002", Username: "jane"}];
 * saveUsers(newUsers);
 * 
 * @param {Array} userData - Array berisi data user
 * @returns {boolean} True jika berhasil menyimpan
 */
export const saveUsers = (userData) => saveToStorage(STORAGE_KEYS.USER, userData);

/**
 * Menambah user baru ke localStorage
 * User baru akan ditambahkan ke akhir array yang sudah ada
 * 
 * Cara pakai: 
 * const newUser = {
 *   ID_User: "USR003",
 *   Username: "newuser",
 *   Email: "newuser@email.com",
 *   Password: "password123",
 *   Role: "mahasiswa"
 * };
 * addUser(newUser);
 * 
 * @param {Object} user - Object data user baru
 * @returns {boolean} True jika berhasil menambah
 */
export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  return saveUsers(users);
};

/**
 * Mengupdate data user berdasarkan ID
 * Menggunakan teknik spread operator untuk menggabung data lama dengan data baru
 * 
 * Cara pakai: 
 * updateUser("USR001", {Email: "newemail@gmail.com", Password: "newpassword"});
 * // Hanya field Email dan Password yang akan diupdate, field lain tetap sama
 * 
 * @param {string} id - ID_User yang akan diupdate
 * @param {Object} updatedUser - Object berisi field yang akan diupdate
 * @returns {boolean} True jika berhasil update, false jika user tidak ditemukan
 */
export const updateUser = (id, updatedUser) => {
  const users = getUsers();
  const index = users.findIndex(user => user.ID_User === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    return saveUsers(users);
  }
  return false;
};

/**
 * Menghapus user berdasarkan ID
 * 
 * Cara pakai: 
 * deleteUser("USR001");
 * 
 * @param {string} id - ID_User yang akan dihapus
 * @returns {boolean} True jika berhasil menghapus
 */
export const deleteUser = (id) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.ID_User !== id);
  return saveUsers(filteredUsers);
};

/**
 * Mencari user berdasarkan ID
 * 
 * Cara pakai: 
 * const user = getUserById("USR001");
 * if (user) {
 *   console.log("User ditemukan:", user.Username);
 * } else {
 *   console.log("User tidak ditemukan");
 * }
 * 
 * @param {string} id - ID_User yang dicari
 * @returns {Object|undefined} Object user jika ditemukan, undefined jika tidak
 */
export const getUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.ID_User === id);
};

/**
 * Mencari user berdasarkan username
 * Berguna untuk proses login atau validasi username unik
 * 
 * Cara pakai: 
 * const user = getUserByUsername("john_doe");
 * if (user) {
 *   console.log("Username sudah digunakan");
 * }
 * 
 * @param {string} username - Username yang dicari
 * @returns {Object|undefined} Object user jika ditemukan
 */
export const getUserByUsername = (username) => {
  const users = getUsers();
  return users.find(user => user.Username === username);
};

/**
 * Mencari user berdasarkan email
 * Berguna untuk proses reset password atau validasi email unik
 * 
 * Cara pakai: 
 * const user = getUserByEmail("john@email.com");
 * 
 * @param {string} email - Email yang dicari
 * @returns {Object|undefined} Object user jika ditemukan
 */
export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.Email === email);
};

// ====================================================
// FUNGSI-FUNGSI UTILITAS TAMBAHAN
// Utility Functions
// ====================================================

/**
 * Menghapus semua data dari localStorage
 * Menghapus semua key yang terdefinisi dalam STORAGE_KEYS
 * Cara pakai: clearAllData();
 * @returns {boolean} True jika berhasil
 */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    clearStorage(key);
  });
  return true;
};

/**
 * Inisialisasi data awal ke localStorage
 * Berguna untuk setup data default saat pertama kali aplikasi berjalan
 * Cara pakai: initializeData({USER: [{id: 1, name: "Admin"}], MAHASISWA: []});
 * @param {Object} initialData - Object berisi data awal untuk setiap key
 * @returns {boolean} True jika berhasil
 */
export const initializeData = (initialData = {}) => {
  Object.entries(initialData).forEach(([key, data]) => {
    if (STORAGE_KEYS[key]) {
      saveToStorage(STORAGE_KEYS[key], data);
    }
  });
  return true;
};

/**
 * Mengambil semua data dari localStorage
 * Mengembalikan object berisi semua data dari semua key yang terdefinisi
 * Cara pakai: const allData = getAllData();
 * @returns {Object} Object berisi semua data
 */
export const getAllData = () => {
  const allData = {};
  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    allData[key] = getFromStorage(storageKey);
  });
  return allData;
};

// ====================================================
// FUNGSI-FUNGSI UNTUK AUTENTIKASI
// Authentication Helper Functions
// ====================================================

/**
 * Autentikasi user berdasarkan username dan password
 * Mencari user yang memiliki kombinasi username dan password yang tepat
 * 
 * Cara pakai dalam komponen login:
 * const handleLogin = (username, password) => {
 *   const user = authenticateUser(username, password);
 *   if (user) {
 *     setCurrentUser(user);
 *     navigate('/dashboard');
 *   } else {
 *     alert('Username atau password salah');
 *   }
 * };
 * 
 * @param {string} username - Username untuk login
 * @param {string} password - Password untuk login
 * @returns {Object|undefined} Object user jika berhasil, undefined jika gagal
 */
export const authenticateUser = (username, password) => {
  const users = getUsers();
  return users.find(user => 
    user.Username === username && user.Password === password
  );
};

/**
 * Mengambil data user yang sedang login saat ini
 * Data disimpan dengan key 'currentUser' di localStorage
 * 
 * Cara pakai dalam AuthContext atau komponen:
 * const currentUser = getCurrentUser();
 * if (currentUser) {
 *   console.log("User sedang login:", currentUser.Username);
 *   console.log("Role user:", currentUser.Role);
 * }
 * 
 * @returns {Object|null} Object user jika ada yang login, null jika tidak ada
 */
export const getCurrentUser = () => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Menyimpan data user yang sedang login
 * Menyimpan ke localStorage dengan key 'currentUser'
 * 
 * Cara pakai setelah login berhasil:
 * const user = authenticateUser(username, password);
 * if (user) {
 *   setCurrentUser(user);
 *   // User sekarang tersimpan sebagai user yang sedang login
 * }
 * 
 * @param {Object} user - Object data user yang login
 * @returns {boolean} True jika berhasil, false jika gagal
 */
export const setCurrentUser = (user) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error setting current user:', error);
    return false;
  }
};

/**
 * Logout user - menghapus data user yang sedang login
 * Menghapus key 'currentUser' dari localStorage
 * 
 * Cara pakai dalam tombol logout:
 * const handleLogout = () => {
 *   logout();
 *   navigate('/login');
 * };
 * 
 * @returns {boolean} True jika berhasil, false jika gagal
 */
export const logout = () => {
  try {
    localStorage.removeItem('currentUser');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

// ====================================================
// EKSPOR KONSTANTA
// Export Storage Keys for Reference
// ====================================================

/**
 * Konstanta kunci-kunci localStorage yang digunakan
 * Gunakan konstanta ini untuk referensi key yang tersedia
 * Contoh: STORAGE_KEYS.USER, STORAGE_KEYS.MAHASISWA, dll.
 */
export { STORAGE_KEYS };