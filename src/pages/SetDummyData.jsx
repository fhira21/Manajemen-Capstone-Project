import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Untuk navigasi kembali ke halaman utama

export default function SetDummyData() {
  const [statusMessage, setStatusMessage] = useState('Tekan tombol untuk mengisi data dummy ke LocalStorage.');
  const [isLoading, setIsLoading] = useState(false);

  // --- Definisi Kunci Penyimpanan untuk LocalStorage (SESUAI PERMINTAAN ANDA) ---
  const STORAGE_KEYS = {
    COMMIT: 'COMMIT',        // Data commit Git
    CV_MAHASISWA: 'CV_Mahasiswa', // Data CV mahasiswa
    DOSEN: 'DOSEN',          // Data dosen/pembimbing
    ISSUE: 'ISSUE',          // Data issue/masalah
    MAHASISWA: 'MAHASISWA',   // Data mahasiswa
    MITRA: 'MITRA',          // Data mitra industri
    PROJECT: 'PROJECT',      // Data project
    PROPOSAL: 'PROPOSAL',    // Data proposal project
    USER: 'USER'             // Data user/pengguna
  };

  // --- Data Dummy yang Sudah Direvisi dan Dirapikan ---

  const COMMIT_DATA = [
    {
      "ID_Commit": "CMT001",
      "ID_Project": "PRJ001",
      "Judul_Commit": "Implemented responsive navbar",
      "User": "MHS001",
      "Status": "Done",
      "Tgl_Commit": "2024-05-16",
      "Catatan": "Fixed display issues on mobile devices."
    },
    {
      "ID_Commit": "CMT002",
      "ID_Project": "PRJ002",
      "Judul_Commit": "Fixed database connection string",
      "User": "MHS002",
      "Status": "Done",
      "Tgl_Commit": "2024-05-22",
      "Catatan": "Corrected typo in connection string."
    },
    {
      "ID_Commit": "CMT003",
      "ID_Project": "PRJ003",
      "Judul_Commit": "Updated NLP model with new dataset",
      "User": "MHS003",
      "Status": "Done",
      "Tgl_Commit": "2024-05-27",
      "Catatan": "Retrained model with additional social media data."
    },
    {
      "ID_Commit": "CMT004",
      "ID_Project": "PRJ001",
      "Judul_Commit": "Added 'Electronics' category",
      "User": "MHS005",
      "Status": "Done",
      "Tgl_Commit": "2024-05-19",
      "Catatan": "New category now visible on homepage."
    },
    {
      "ID_Commit": "CMT005",
      "ID_Project": "PRJ002",
      "Judul_Commit": "Implemented lazy loading for images",
      "User": "MHS006",
      "Status": "Done",
      "Tgl_Commit": "2024-05-24",
      "Catatan": "Improved app loading performance."
    },
    {
      "ID_Commit": "CMT006",
      "ID_Project": "PRJ006",
      "Judul_Commit": "Integrated Midtrans payment gateway",
      "User": "MHS001",
      "Status": "Done",
      "Tgl_Commit": "2024-06-07",
      "Catatan": "Payment functionality now working."
    },
    {
      "ID_Commit": "CMT007",
      "ID_Project": "PRJ007",
      "Judul_Commit": "Revised scoring logic for quizzes",
      "User": "MHS005",
      "Status": "Done",
      "Tgl_Commit": "2024-06-12",
      "Catatan": "Scores are now calculated correctly."
    },
    {
      "ID_Commit": "CMT008",
      "ID_Project": "PRJ008",
      "Judul_Commit": "Implemented MQTT protocol for sensor data",
      "User": "MHS008",
      "Status": "Done",
      "Tgl_Commit": "2024-06-17",
      "Catatan": "Sensor data is now successfully transmitted."
    },
    {
      "ID_Commit": "CMT009",
      "ID_Project": "PRJ009",
      "Judul_Commit": "Fine-tuned fraud detection model parameters",
      "User": "MHS010",
      "Status": "Done",
      "Tgl_Commit": "2024-06-22",
      "Catatan": "Reduced false positive rate by 15%."
    },
    {
      "ID_Commit": "CMT010",
      "ID_Project": "PRJ010",
      "Judul_Commit": "Drafted initial documentation for blockchain module",
      "User": "MHS003",
      "Status": "Done",
      "Tgl_Commit": "2024-06-27",
      "Catatan": "Outlined API endpoints and data structures."
    }
  ];

  const CV_MAHASISWA_DATA = [
    {
      "ID_CV": "CV001",
      "ID_User": "USR003",
      "Nama": "Alice Wonderland",
      "Tanggal_Lahir": "2003-01-01",
      "Gender": "Perempuan",
      "Email": "alice.w@example.com",
      "Telepon": "081234567890",
      "Email_Aktif": "alice.w@example.com",
      "Alamat": "Jl. Mawar No. 123",
      "Ringkasan": "Mahasiswa dengan pengalaman dalam pengembangan web dan manajemen proyek.",
      "Link_Penghubung": "https://linkedin.com/in/alice",
      "Pengalaman_Project": "Created a web application for task management.",
      "Pengalaman_Organisasi": "Secretary of Student Council.",
      "Pengalaman_Pelatihan": "Attended 'Full Stack Web Development' bootcamp.",
      "Bidang": "Web Development",
      "Keterampilan": "React, Node.js, MongoDB"
    },
    {
      "ID_CV": "CV002",
      "ID_User": "USR006",
      "Nama": "Diana Prince",
      "Tanggal_Lahir": "2003-02-01",
      "Gender": "Perempuan",
      "Email": "diana.k@example.com",
      "Telepon": "087654321098",
      "Email_Aktif": "diana.k@example.com",
      "Alamat": "Jl. Melati No. 45",
      "Ringkasan": "Mahasiswa dengan pengalaman dalam pengembangan aplikasi mobile dan desain.",
      "Link_Penghubung": "https://github.com/dianaprince",
      "Pengalaman_Project": "Developed a mobile app for fitness tracking.",
      "Pengalaman_Organisasi": "Head of Public Relations for IT Club.",
      "Pengalaman_Pelatihan": "Completed 'Mobile App Design' course.",
      "Bidang": "Mobile Development",
      "Keterampilan": "Flutter, Dart, Firebase"
    },
    {
      "ID_CV": "CV003",
      "ID_User": "USR008",
      "Nama": "Frankenstein",
      "Tanggal_Lahir": "2003-03-01",
      "Gender": "Laki-laki",
      "Email": "frank.t@example.com",
      "Telepon": "081122334455",
      "Email_Aktif": "frank.t@example.com",
      "Alamat": "Jl. Tulip No. 67",
      "Ringkasan": "Mahasiswa dengan keahlian dalam data science dan visualisasi data.",
      "Link_Penghubung": "https://gitlab.com/frankenstein",
      "Pengalaman_Project": "Built a data visualization dashboard.",
      "Pengalaman_Organisasi": "Treasurer of Robotics Club.",
      "Pengalaman_Pelatihan": "Certified in 'Data Science with Python'.",
      "Bidang": "Data Science",
      "Keterampilan": "Python, Pandas, Matplotlib"
    },
    {
      "ID_CV": "CV004",
      "ID_User": "USR011",
      "Nama": "Harry Potter",
      "Tanggal_Lahir": "2003-04-01",
      "Gender": "Laki-laki",
      "Email": "harry.p@example.com",
      "Telepon": "089988776655",
      "Email_Aktif": "harry.p@example.com",
      "Alamat": "Jl. Edelweiss No. 89",
      "Ringkasan": "Mahasiswa dengan minat dalam pengembangan game dan desain 3D.",
      "Link_Penghubung": "https://linkedin.com/in/harrypotter",
      "Pengalaman_Project": "Designed and implemented a game using Unity.",
      "Pengalaman_Organisasi": "Member of Game Development Community.",
      "Pengalaman_Pelatihan": "Participated in 'Game Design Fundamentals' workshop.",
      "Bidang": "Game Development",
      "Keterampilan": "Unity, C#, Blender"
    },
    {
      "ID_CV": "CV005",
      "ID_User": "USR013",
      "Nama": "Iris West",
      "Tanggal_Lahir": "2003-05-01",
      "Gender": "Perempuan",
      "Email": "iris.w@example.com",
      "Telepon": "081212121212",
      "Email_Aktif": "iris.w@example.com",
      "Alamat": "Jl. Dahlia No. 10",
      "Ringkasan": "Mahasiswa dengan keahlian dalam pengembangan web front-end.",
      "Link_Penghubung": "https://github.com/iriswest",
      "Pengalaman_Project": "Created a responsive e-commerce website.",
      "Pengalaman_Organisasi": "Publicity Chair for Photography Club.",
      "Pengalaman_Pelatihan": "Finished 'Front-End Web Development' specialization.",
      "Bidang": "Web Development",
      "Keterampilan": "HTML, CSS, JavaScript, React"
    },
    {
      "ID_CV": "CV006",
      "ID_User": "USR015",
      "Nama": "Jack Sparrow",
      "Tanggal_Lahir": "2003-06-01",
      "Gender": "Laki-laki",
      "Email": "jack.s@example.com",
      "Telepon": "085656565656",
      "Email_Aktif": "jack.s@example.com",
      "Alamat": "Jl. Anggrek No. 20",
      "Ringkasan": "Mahasiswa dengan fokus pada keamanan siber dan sistem otentikasi.",
      "Link_Penghubung": "https://gitlab.com/jacksparrow",
      "Pengalaman_Project": "Developed a secure authentication system.",
      "Pengalaman_Organisasi": "Security Lead for Cyber Security Club.",
      "Pengalaman_Pelatihan": "Completed 'Cybersecurity Basics' certification.",
      "Bidang": "Cybersecurity",
      "Keterampilan": "Network Security, Cryptography, Linux"
    },
    {
      "ID_CV": "CV007",
      "ID_User": "USR017",
      "Nama": "Katniss Everdeen",
      "Tanggal_Lahir": "2003-07-01",
      "Gender": "Perempuan",
      "Email": "katniss.e@example.com",
      "Telepon": "087878787878",
      "Email_Aktif": "katniss.e@example.com",
      "Alamat": "Jl. Teratai No. 30",
      "Ringkasan": "Mahasiswa dengan keahlian dalam kecerdasan buatan dan analisis sentimen.",
      "Link_Penghubung": "https://linkedin.com/in/katnisseverdeen",
      "Pengalaman_Project": "Implemented a machine learning model for sentiment analysis.",
      "Pengalaman_Organisasi": "Research Assistant at AI Lab.",
      "Pengalaman_Pelatihan": "Attended 'Deep Learning Specialization'.",
      "Bidang": "Artificial Intelligence",
      "Keterampilan": "TensorFlow, Keras, Python"
    },
    {
      "ID_CV": "CV008",
      "ID_User": "USR019",
      "Nama": "Luke Skywalker",
      "Tanggal_Lahir": "2003-08-01",
      "Gender": "Laki-laki",
      "Email": "luke.s@example.com",
      "Telepon": "081313131313",
      "Email_Aktif": "luke.s@example.com",
      "Alamat": "Jl. Kemuning No. 40",
      "Ringkasan": "Mahasiswa dengan minat dalam teknologi blockchain dan sistem terdesentralisasi.",
      "Link_Penghubung": "https://github.com/lukeskywalker",
      "Pengalaman_Project": "Built a blockchain-based voting system.",
      "Pengalaman_Organisasi": "Blockchain Enthusiast Community Member.",
      "Pengalaman_Pelatihan": "Certified in 'Blockchain Development'.",
      "Bidang": "Blockchain",
      "Keterampilan": "Solidity, Ethereum, Web3.js"
    },
    {
      "ID_CV": "CV009",
      "ID_User": "USR021",
      "Nama": "Mulan",
      "Tanggal_Lahir": "2003-09-01",
      "Gender": "Perempuan",
      "Email": "mulan@example.com",
      "Telepon": "082323232323",
      "Email_Aktif": "mulan@example.com",
      "Alamat": "Jl. Kamboja No. 50",
      "Ringkasan": "Mahasiswa dengan bakat dalam desain UI/UX untuk aplikasi dan web.",
      "Link_Penghubung": "https://gitlab.com/mulan",
      "Pengalaman_Project": "Designed a UI/UX for a mobile application.",
      "Pengalaman_Organisasi": "Creative Director for Design Club.",
      "Pengalaman_Pelatihan": "Completed 'UI/UX Design Masterclass'.",
      "Bidang": "UI/UX Design",
      "Keterampilan": "Figma, Sketch, Adobe XD"
    },
    {
      "ID_CV": "CV010",
      "ID_User": "USR023",
      "Nama": "Neo Anderson",
      "Tanggal_Lahir": "2003-10-01",
      "Gender": "Laki-laki",
      "Email": "neo.a@example.com",
      "Telepon": "081414141414",
      "Email_Aktif": "neo.a@example.com",
      "Alamat": "Jl. Bakung No. 60",
      "Ringkasan": "Mahasiswa dengan spesialisasi di komputasi awan dan solusi backup data.",
      "Link_Penghubung": "https://linkedin.com/in/neoanderson",
      "Pengalaman_Project": "Developed a cloud-based data backup solution.",
      "Pengalaman_Organisasi": "Cloud Computing Interest Group Leader.",
      "Pengalaman_Pelatihan": "AWS Certified Solutions Architect.",
      "Bidang": "Cloud Computing",
      "Keterampilan": "AWS, Azure, Google Cloud"
    },
    {
      "ID_CV": "CV011",
      "ID_User": "USR031",
      "Nama": "Asrull",
      "Tanggal_Lahir": "2003-11-01",
      "Gender": "Laki-laki",
      "Email": "asrull.a@example.com",
      "Telepon": "081234567891",
      "Email_Aktif": "asrull.a@example.com",
      "Alamat": "Jl. Sudirman No. 10",
      "Ringkasan": "Mahasiswa dengan minat pada pengembangan IT dan manajemen proyek.",
      "Link_Penghubung": "https://github.com/asrull",
      "Pengalaman_Project": "Developed a project management tool for student teams.",
      "Pengalaman_Organisasi": "Member of IT Student Association.",
      "Pengalaman_Pelatihan": "Completed 'Project Management Fundamentals' course.",
      "Bidang": "IT Project Management",
      "Keterampilan": "Project Planning, Team Leadership, Software Development"
    }
  ];

  const DOSEN_DATA = [
    {
      "ID_Dosen": "DSN001",
      "ID_User": "USR002",
      "Nama": "Jane Doe",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "1234567890"
    },
    {
      "ID_Dosen": "DSN002",
      "ID_User": "USR004",
      "Nama": "Bob Marley",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "0987654321"
    },
    {
      "ID_Dosen": "DSN003",
      "ID_User": "USR007",
      "Nama": "Evan Smith",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "1122334455"
    },
    {
      "ID_Dosen": "DSN004",
      "ID_User": "USR010",
      "Nama": "Henry Golding",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "5544332211"
    },
    {
      "ID_Dosen": "DSN005",
      "ID_User": "USR012",
      "Nama": "Olivia Wilson",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "9876123456"
    },
    {
      "ID_Dosen": "DSN006",
      "ID_User": "USR014",
      "Nama": "Peter Parker",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "6789012345"
    },
    {
      "ID_Dosen": "DSN007",
      "ID_User": "USR016",
      "Nama": "Quinn Fabray",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "2345678901"
    },
    {
      "ID_Dosen": "DSN008",
      "ID_User": "USR018",
      "Nama": "Rachel Green",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "8901234567"
    },
    {
      "ID_Dosen": "DSN009",
      "ID_User": "USR020",
      "Nama": "Samwise Gamgee",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "3456789012"
    },
    {
      "ID_Dosen": "DSN010",
      "ID_User": "USR022",
      "Nama": "Tina Fey",
      "Foto_Profile": "https://c.tenor.com/ENgTZmyhfCwAAAAC/tenor.gif",
      "NIP": "7890123456"
    }
  ];

  const ISSUE_DATA = [
    {
      "ID_Issue": "ISS001",
      "ID_Project": "PRJ001",
      "Judul_Issue": "Frontend UI responsiveness issue",
      "User": "MHS001",
      "Status": "Open",
      "Tgl_Buat": "2024-05-16",
      "Tgl_Update": "2024-05-17",
      "Label": "Bug"
    },
    {
      "ID_Issue": "ISS002",
      "ID_Project": "PRJ002",
      "Judul_Issue": "Database connection error on login",
      "User": "MHS002",
      "Status": "Closed",
      "Tgl_Buat": "2024-05-21",
      "Tgl_Update": "2024-05-22",
      "Label": "Bug"
    },
    {
      "ID_Issue": "ISS003",
      "ID_Project": "PRJ003",
      "Judul_Issue": "Model accuracy below threshold",
      "User": "MHS003",
      "Status": "Open",
      "Tgl_Buat": "2024-05-26",
      "Tgl_Update": "2024-05-27",
      "Label": "Improvement"
    },
    {
      "ID_Issue": "ISS004",
      "ID_Project": "PRJ001",
      "Judul_Issue": "Add new product category to website",
      "User": "MTR001",
      "Status": "Open",
      "Tgl_Buat": "2024-05-18",
      "Tgl_Update": "2024-05-19",
      "Label": "Feature Request"
    },
    {
      "ID_Issue": "ISS005",
      "ID_Project": "PRJ002",
      "Judul_Issue": "Optimize image loading in app",
      "User": "MHS006",
      "Status": "Open",
      "Tgl_Buat": "2024-05-23",
      "Tgl_Update": "2024-05-24",
      "Label": "Performance"
    },
    {
      "ID_Issue": "ISS006",
      "ID_Project": "PRJ006",
      "Judul_Issue": "Integration with payment gateway failing",
      "User": "MHS001",
      "Status": "Open",
      "Tgl_Buat": "2024-06-06",
      "Tgl_Update": "2024-06-07",
      "Label": "Bug"
    },
    {
      "ID_Issue": "ISS007",
      "ID_Project": "PRJ007",
      "Judul_Issue": "Gamification scoring not accurate",
      "User": "MHS005",
      "Status": "Open",
      "Tgl_Buat": "2024-06-11",
      "Tgl_Update": "2024-06-12",
      "Label": "Bug"
    },
    {
      "ID_Issue": "ISS008",
      "ID_Project": "PRJ008",
      "Judul_Issue": "Sensor data not being transmitted to cloud",
      "User": "MHS008",
      "Status": "Open",
      "Tgl_Buat": "2024-06-16",
      "Tgl_Update": "2024-06-17",
      "Label": "Bug"
    },
    {
      "ID_Issue": "ISS009",
      "ID_Project": "PRJ009",
      "Judul_Issue": "False positives in fraud detection",
      "User": "MHS010",
      "Status": "Closed",
      "Tgl_Buat": "2024-06-21",
      "Tgl_Update": "2024-06-22",
      "Label": "Improvement"
    },
    {
      "ID_Issue": "ISS010",
      "ID_Project": "PRJ010",
      "Judul_Issue": "Documentation for blockchain integration needed",
      "User": "MHS003",
      "Status": "Open",
      "Tgl_Buat": "2024-06-26",
      "Tgl_Update": "2024-06-27",
      "Label": "Documentation"
    }
  ];

  const MAHASISWA_DATA = [
    {
      "ID_Mahasiswa": "MHS001",
      "ID_User": "USR003",
      "Nama": "Alice Wonderland",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022001",
      "Jenis_Kelamin": "Perempuan",
      "No_Telepon": "081234567890",
      "Alamat": "Jl. Mawar No. 123",
      "ID_CV": "CV001"
    },
    {
      "ID_Mahasiswa": "MHS002",
      "ID_User": "USR006",
      "Nama": "Diana Prince",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022002",
      "Jenis_Kelamin": "Perempuan",
      "No_Telepon": "087654321098",
      "Alamat": "Jl. Melati No. 45",
      "ID_CV": "CV002"
    },
    {
      "ID_Mahasiswa": "MHS003",
      "ID_User": "USR008",
      "Nama": "Frankenstein",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022003",
      "Jenis_Kelamin": "Laki-laki",
      "No_Telepon": "081122334455",
      "Alamat": "Jl. Tulip No. 67",
      "ID_CV": "CV003"
    },
    {
      "ID_Mahasiswa": "MHS004",
      "ID_User": "USR011",
      "Nama": "Harry Potter",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022004",
      "Jenis_Kelamin": "Laki-laki",
      "No_Telepon": "089988776655",
      "Alamat": "Jl. Edelweiss No. 89",
      "ID_CV": "CV004"
    },
    {
      "ID_Mahasiswa": "MHS005",
      "ID_User": "USR013",
      "Nama": "Iris West",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022005",
      "Jenis_Kelamin": "Perempuan",
      "No_Telepon": "081212121212",
      "Alamat": "Jl. Dahlia No. 10",
      "ID_CV": "CV005"
    },
    {
      "ID_Mahasiswa": "MHS006",
      "ID_User": "USR015",
      "Nama": "Jack Sparrow",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022006",
      "Jenis_Kelamin": "Laki-laki",
      "No_Telepon": "085656565656",
      "Alamat": "Jl. Anggrek No. 20",
      "ID_CV": "CV006"
    },
    {
      "ID_Mahasiswa": "MHS007",
      "ID_User": "USR017",
      "Nama": "Katniss Everdeen",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022007",
      "Jenis_Kelamin": "Perempuan",
      "No_Telepon": "087878787878",
      "Alamat": "Jl. Teratai No. 30",
      "ID_CV": "CV007"
    },
    {
      "ID_Mahasiswa": "MHS008",
      "ID_User": "USR019",
      "Nama": "Luke Skywalker",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022008",
      "Jenis_Kelamin": "Laki-laki",
      "No_Telepon": "081313131313",
      "Alamat": "Jl. Kemuning No. 40",
      "ID_CV": "CV008"
    },
    {
      "ID_Mahasiswa": "MHS009",
      "ID_User": "USR021",
      "Nama": "Mulan",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022009",
      "Jenis_Kelamin": "Perempuan",
      "No_Telepon": "082323232323",
      "Alamat": "Jl. Kamboja No. 50",
      "ID_CV": "CV009"
    },
    {
      "ID_Mahasiswa": "MHS010",
      "ID_User": "USR023",
      "Nama": "Neo Anderson",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022010",
      "Jenis_Kelamin": "Laki-laki",
      "No_Telepon": "081414141414",
      "Alamat": "Jl. Bakung No. 60",
      "ID_CV": "CV010"
    },
    {
      "ID_Mahasiswa": "MHS011",
      "ID_User": "USR031",
      "Nama": "Asrull",
      "Foto_Profile": "https://c.tenor.com/gm_mhpzK1wsAAAAC/tenor.gif",
      "NIM": "2022011",
      "Jenis_Kelamin": "Laki-laki",
      "No_Telepon": "081234567891",
      "Alamat": "Jl. Sudirman No. 10",
      "ID_CV": "CV011"
    }
  ];

  const MITRA_DATA = [
    {
      "ID_Mitra": "MTR001",
      "ID_User": "USR001",
      "Nama_Perusahaan": "Tech Solutions Inc.",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=TechSolutions",
      "No_Telepon": "021-1234567"
    },
    {
      "ID_Mitra": "MTR002",
      "ID_User": "USR005",
      "Nama_Perusahaan": "Creative Minds Studio",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=CreativeMinds",
      "No_Telepon": "021-9876543"
    },
    {
      "ID_Mitra": "MTR003",
      "ID_User": "USR009",
      "Nama_Perusahaan": "Global Data Analytics",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=GlobalData",
      "No_Telepon": "021-1122334"
    },
    {
      "ID_Mitra": "MTR004",
      "ID_User": "USR024",
      "Nama_Perusahaan": "Innovate IT Solutions",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=InnovateIT",
      "No_Telepon": "021-5566778"
    },
    {
      "ID_Mitra": "MTR005",
      "ID_User": "USR025",
      "Nama_Perusahaan": "Digital Marketing Pro",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=DigitalMarketing",
      "No_Telepon": "021-9988776"
    },
    {
      "ID_Mitra": "MTR006",
      "ID_User": "USR026",
      "Nama_Perusahaan": "Health Tech Innovations",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=HealthTech",
      "No_Telepon": "021-1010101"
    },
    {
      "ID_Mitra": "MTR007",
      "ID_User": "USR027",
      "Nama_Perusahaan": "EduTech Solutions",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=EduTech",
      "No_Telepon": "021-2020202"
    },
    {
      "ID_Mitra": "MTR008",
      "ID_User": "USR028",
      "Nama_Perusahaan": "Green Energy Systems",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=GreenEnergy",
      "No_Telepon": "021-3030303"
    },
    {
      "ID_Mitra": "MTR009",
      "ID_User": "USR029",
      "Nama_Perusahaan": "Fintech Innovations Co.",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=FintechInnov",
      "No_Telepon": "021-4040404"
    },
    {
      "ID_Mitra": "MTR010",
      "ID_User": "USR030",
      "Nama_Perusahaan": "Logistics Master Inc.",
      "Foto_Profile": "https://placehold.co/150x150/000000/FFFFFF?text=LogisticsMaster",
      "No_Telepon": "021-5050505"
    }
  ];

  const PROJECT_DATA = [
    {
      "ID_Project": "PRJ001",
      "ID_Dosen": "DSN001",
      "ID_Proposal": "PRP001",
      "ID_Mitra": "MTR001",
      "ID_Mahasiswa": ["MHS001", "MHS005", "MHS009"],
      "Nama_Project": "Website Redesign for E-commerce",
      "Tgl_Update_Project": "2024-05-15",
      "Tgl_Rapat": "2024-05-10",
      "Status": "Perencanaan"
    },
    {
      "ID_Project": "PRJ002",
      "ID_Dosen": "DSN002",
      "ID_Proposal": "PRP002",
      "ID_Mitra": "MTR002",
      "ID_Mahasiswa": ["MHS002", "MHS006"],
      "Nama_Project": "Mobile App for Event Management",
      "Tgl_Update_Project": "2024-05-20",
      "Tgl_Rapat": "2024-05-15",
      "Status": "Pengembangan"
    },
    {
      "ID_Project": "PRJ003",
      "ID_Dosen": "DSN003",
      "ID_Proposal": "PRP003",
      "ID_Mitra": "MTR003",
      "ID_Mahasiswa": ["MHS003", "MHS007"],
      "Nama_Project": "Market Sentiment Analysis using AI",
      "Tgl_Update_Project": "2024-05-25",
      "Tgl_Rapat": "2024-05-20",
      "Status": "Pengembangan"
    },
    {
      "ID_Project": "PRJ004",
      "ID_Dosen": "DSN004",
      "ID_Proposal": "PRP004",
      "ID_Mitra": "MTR004",
      "ID_Mahasiswa": ["MHS004", "MHS008"],
      "Nama_Project": "Cloud-based Data Backup System",
      "Tgl_Update_Project": "2024-05-30",
      "Tgl_Rapat": "2024-05-25",
      "Status": "Dikunci"
    },
    {
      "ID_Project": "PRJ005",
      "ID_Dosen": "DSN001",
      "ID_Proposal": "PRP005",
      "ID_Mitra": "MTR005",
      "ID_Mahasiswa": ["MHS010"],
      "Nama_Project": "SEO Optimization for Online Store",
      "Tgl_Update_Project": "2024-06-01",
      "Tgl_Rapat": "2024-05-28",
      "Status": "Selesai"
    },
    {
      "ID_Project": "PRJ006",
      "ID_Dosen": "DSN005",
      "ID_Proposal": "PRP006",
      "ID_Mitra": "MTR006",
      "ID_Mahasiswa": ["MHS001", "MHS002", "MHS003", "MHS004"],
      "Nama_Project": "Telemedicine Platform Prototype",
      "Tgl_Update_Project": "2024-06-05",
      "Tgl_Rapat": "2024-06-01",
      "Status": "Pengembangan"
    },
    {
      "ID_Project": "PRJ007",
      "ID_Dosen": "DSN006",
      "ID_Proposal": "PRP007",
      "ID_Mitra": "MTR007",
      "ID_Mahasiswa": ["MHS005", "MHS006", "MHS007"],
      "Nama_Project": "Educational Gamification Module",
      "Tgl_Update_Project": "2024-06-10",
      "Tgl_Rapat": "2024-06-05",
      "Status": "Perencanaan"
    },
    {
      "ID_Project": "PRJ008",
      "ID_Dosen": "DSN007",
      "ID_Proposal": "PRP008",
      "ID_Mitra": "MTR008",
      "ID_Mahasiswa": ["MHS008", "MHS009"],
      "Nama_Project": "Smart Home Energy Monitoring System",
      "Tgl_Update_Project": "2024-06-15",
      "Tgl_Rapat": "2024-06-10",
      "Status": "Pengembangan"
    },
    {
      "ID_Project": "PRJ009",
      "ID_Dosen": "DSN008",
      "ID_Proposal": "PRP009",
      "ID_Mitra": "MTR009",
      "ID_Mahasiswa": ["MHS010", "MHS001", "MHS002"],
      "Nama_Project": "Fraud Detection System for Online Transactions",
      "Tgl_Update_Project": "2024-06-20",
      "Tgl_Rapat": "2024-06-15",
      "Status": "Dikunci"
    },
    {
      "ID_Project": "PRJ010",
      "ID_Dosen": "DSN009",
      "ID_Proposal": "PRP010",
      "ID_Mitra": "MTR010",
      "ID_Mahasiswa": ["MHS003", "MHS004"],
      "Nama_Project": "Supply Chain Optimization with Blockchain",
      "Tgl_Update_Project": "2024-06-25",
      "Tgl_Rapat": "2024-06-20",
      "Status": "Selesai"
    }
  ];

  const PROPOSAL_DATA = [
    {
      "ID_Proposal": "PRP001",
      "ID_Mitra": "MTR001",
      "Judul_Project": "Website Redesign for E-commerce",
      "Kategori_Project": ["Pengembangan", "Website", "UI/UX", "Front-end", "E-commerce", "Digital Marketing"],
      "Deskripsi_Masalah": "Current website is outdated and not mobile-friendly.",
      "Goals": "Increase conversion rate by 20% and improve user experience.",
      "Jumlah_orang": 3,
      "Informasi_Tambahan": "Looking for students with expertise in UI/UX and front-end development.",
      "status": "Disetujui",
      "tanggal": "16 April 2025"
    },
    {
      "ID_Proposal": "PRP002",
      "ID_Mitra": "MTR002",
      "Judul_Project": "Mobile App for Event Management",
      "Kategori_Project": ["Pengembangan", "Mobile", "Android", "iOS"],
      "Deskripsi_Masalah": "No dedicated mobile app for managing company events.",
      "Goals": "Develop an intuitive app for event registration and scheduling.",
      "Jumlah_orang": 4,
      "Informasi_Tambahan": "Need students familiar with native mobile development (iOS/Android).",
      "status": "Revisi",
      "tanggal": "10 Mei 2025"
    },
    {
      "ID_Proposal": "PRP003",
      "ID_Mitra": "MTR003",
      "Judul_Project": "Market Sentiment Analysis using AI",
      "Kategori_Project": ["Penelitian", "AI", "Machine Learning", "Data Science"],
      "Deskripsi_Masalah": "Lack of automated tools for analyzing market sentiment from social media.",
      "Goals": "Build an AI model to analyze sentiment and generate reports.",
      "Jumlah_orang": 2,
      "Informasi_Tambahan": "Seeking students with strong background in NLP and machine learning.",
      "status": "Menunggu",
      "tanggal": "27 April 2025"
    },
    {
      "ID_Proposal": "PRP004",
      "ID_Mitra": "MTR004",
      "Judul_Project": "Cloud-based Data Backup System",
      "Kategori_Project": ["Pengembangan", "Cloud Computing", "Data Science"],
      "Deskripsi_Masalah": "Current data backup solution is unreliable and not scalable.",
      "Goals": "Implement a robust and scalable cloud-based backup system.",
      "Jumlah_orang": 3,
      "Informasi_Tambahan": "Experience with AWS or Azure is a plus.",
      "status": "Disetujui",
      "tanggal": "14 Mei 2025"
    },
    {
      "ID_Proposal": "PRP005",
      "ID_Mitra": "MTR005",
      "Judul_Project": "SEO Optimization for Online Store",
      "Kategori_Project": ["Perencanaan", "Website", "Digital Marketing"],
      "Deskripsi_Masalah": "Low organic traffic to the online store.",
      "Goals": "Improve search engine ranking and increase organic traffic by 30%.",
      "Jumlah_orang": 2,
      "Informasi_Tambahan": "Knowledge of SEO best practices and content marketing.",
      "status": "Revisi",
      "tanggal": "29 Mei 2025"
    },
    {
      "ID_Proposal": "PRP006",
      "ID_Mitra": "MTR006",
      "Judul_Project": "Telemedicine Platform Prototype",
      "Kategori_Project": ["Pengembangan", "Website", "Mobile", "Healthcare"],
      "Deskripsi_Masalah": "Need a prototype for a new telemedicine platform.",
      "Goals": "Develop a basic functional prototype for patient-doctor consultations.",
      "Jumlah_orang": 4,
      "Informasi_Tambahan": "Familiarity with healthcare industry regulations is beneficial.",
      "status": "Menunggu",
      "tanggal": "30 Mei 2025"
    },
    {
      "ID_Proposal": "PRP007",
      "ID_Mitra": "MTR007",
      "Judul_Project": "Educational Gamification Module",
      "Kategori_Project": ["Pengembangan", "Desktop", "Game Development", "Education"],
      "Deskripsi_Masalah": "Students find learning materials unengaging.",
      "Goals": "Create an interactive gamified module to improve student engagement.",
      "Jumlah_orang": 3,
      "Informasi_Tambahan": "Experience in game design or educational technology.",
      "status": "Disetujui",
      "tanggal": "02 Juni 2025"
    },
    {
      "ID_Proposal": "PRP008",
      "ID_Mitra": "MTR008",
      "Judul_Project": "Smart Home Energy Monitoring System",
      "Kategori_Project": ["Penelitian", "IoT", "Data Science", "Embedded Systems"],
      "Deskripsi_Masalah": "Lack of real-time energy consumption monitoring in smart homes.",
      "Goals": "Research and develop a prototype for a smart energy monitoring system.",
      "Jumlah_orang": 2,
      "Informasi_Tambahan": "Background in IoT and embedded systems.",
      "status": "Menunggu",
      "tanggal": "04 Juni 2025"
    },
    {
      "ID_Proposal": "PRP009",
      "ID_Mitra": "MTR009",
      "Judul_Project": "Fraud Detection System for Online Transactions",
      "Kategori_Project": ["Pengembangan", "AI", "Machine Learning", "Security"],
      "Deskripsi_Masalah": "Increasing number of fraudulent online transactions.",
      "Goals": "Build a machine learning-based system to detect and prevent fraud.",
      "Jumlah_orang": 3,
      "Informasi_Tambahan": "Expertise in anomaly detection and big data.",
      "status": "Revisi",
      "tanggal": "08 Juni 2025"
    },
    {
      "ID_Proposal": "PRP010",
      "ID_Mitra": "MTR010",
      "Judul_Project": "Supply Chain Optimization with Blockchain",
      "Kategori_Project": ["Penelitian", "Blockchain", "Data Science", "Business"],
      "Deskripsi_Masalah": "Lack of transparency and traceability in the supply chain.",
      "Goals": "Explore the feasibility of using blockchain for supply chain optimization.",
      "Jumlah_orang": 2,
      "Informasi_Tambahan": "Interest in blockchain technology and logistics.",
      "status": "Disetujui",
      "tanggal": "10 Juni 2025"
    }
  ];

  const USER_DATA = [
    {
      "ID_User": "USR001",
      "Username": "johndoe",
      "Email": "john.doe@example.com",
      "Password": "hashedpassword1",
      "Role": "Mitra"
    },
    {
      "ID_User": "USR002",
      "Username": "janedoe",
      "Email": "jane.doe@example.com",
      "Password": "hashedpassword2",
      "Role": "Dosen"
    },
    {
      "ID_User": "USR003",
      "Username": "alicew",
      "Email": "alice.w@example.com",
      "Password": "hashedpassword3",
      "Role": "Mahasiswa"
    },
    {
      "ID_User": "USR004",
      "Username": "bobm",
      "Email": "bob.m@example.com",
      "Password": "hashedpassword4",
      "Role": "Dosen"
    },
    {
      "ID_User": "USR005",
      "Username": "charliep",
      "Email": "charlie.p@example.com",
      "Password": "hashedpassword5",
      "Role": "Mitra"
    },
    {
      "ID_User": "USR006",
      "Username": "dianak",
      "Email": "diana.k@example.com",
      "Password": "hashedpassword6",
      "Role": "Mahasiswa"
    },
    {
      "ID_User": "USR007",
      "Username": "evans",
      "Email": "evan.s@example.com",
      "Password": "hashedpassword7",
      "Role": "Dosen"
    },
    {
      "ID_User": "USR008",
      "Username": "frankt",
      "Email": "frank.t@example.com",
      "Password": "hashedpassword8",
      "Role": "Mahasiswa"
    },
    {
      "ID_User": "USR009",
      "Username": "graceh",
      "Email": "grace.h@example.com",
      "Password": "hashedpassword9",
      "Role": "Mitra"
    },
    {
      "ID_User": "USR010",
      "Username": "henryg",
      "Email": "henry.g@example.com",
      "Password": "hashedpassword10",
      "Role": "Dosen"
    },
    {
      "ID_User": "USR031", // Ini ID_User baru untuk Asrull, sesuai revisi terakhir
      "Username": "asrull",
      "Email": "asrull.a@example.com",
      "Password": "hashedpassword11",
      "Role": "Mahasiswa"
    }
  ];

  // --- Fungsi untuk Mengatur Data ke LocalStorage ---
  const setDataToLocalStorage = () => {
    setIsLoading(true);
    try {
      localStorage.setItem(STORAGE_KEYS.COMMIT, JSON.stringify(COMMIT_DATA));
      localStorage.setItem(STORAGE_KEYS.CV_MAHASISWA, JSON.stringify(CV_MAHASISWA_DATA));
      localStorage.setItem(STORAGE_KEYS.DOSEN, JSON.stringify(DOSEN_DATA));
      localStorage.setItem(STORAGE_KEYS.ISSUE, JSON.stringify(ISSUE_DATA));
      localStorage.setItem(STORAGE_KEYS.MAHASISWA, JSON.stringify(MAHASISWA_DATA));
      localStorage.setItem(STORAGE_KEYS.MITRA, JSON.stringify(MITRA_DATA));
      localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(PROJECT_DATA));
      localStorage.setItem(STORAGE_KEYS.PROPOSAL, JSON.stringify(PROPOSAL_DATA));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(USER_DATA));
      setStatusMessage('Data dummy berhasil disetel ke LocalStorage!');
    } catch (error) {
      setStatusMessage(`Error saat menyetel data: ${error.message}`);
      console.error("Error setting data to localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fungsi untuk Menghapus Data dari LocalStorage ---
  const clearDataFromLocalStorage = () => {
    setIsLoading(true);
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      setStatusMessage('Semua data dummy berhasil dihapus dari LocalStorage!');
    } catch (error) {
      setStatusMessage(`Error saat menghapus data: ${error.message}`);
      console.error("Error clearing data from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pengaturan Data Dummy</h1>
        <p className="text-gray-600 mb-6 text-lg">{statusMessage}</p>

        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600">Memproses...</span>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={setDataToLocalStorage}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menyetel Data...' : 'Set Semua Data Dummy'}
          </button>
          <button
            onClick={clearDataFromLocalStorage}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menghapus Data...' : 'Hapus Semua Data Dummy'}
          </button>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-blue-600 hover:underline">
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
