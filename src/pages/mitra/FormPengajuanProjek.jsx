import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

// Updated FormRow component to be responsive
const FormRow = ({ label, children }) => (
  <div className="mb-6">
    <label className="block text-gray-700 text-sm md:text-base font-medium mb-2">
      {label}
    </label>
    <div className="w-full">
      {children}
    </div>
  </div>
);

export default function FormPengajuanProjek({ onAddProject }) {
  const navigate = useNavigate();
  
  // 1. Definisikan style untuk input agar bisa dipakai ulang - updated for responsiveness
  const inputStyle = "w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary";
  
  // 2. Lengkapi state untuk semua field yang ada di form
  const [formData, setFormData] = useState({
    title: '',
    company: 'Pt. Mitra Sejahtera',
    description: '',
    kategori: '',
    goals: '',
    jumlahOrang: '',
    infoTambahan: '',
    tech: [], 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProject(formData);
    navigate('/partner/submit-new-project');
  };

  // Handle back button navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <>
      <PageTitle 
        title="Pengajuan Projek Baru"
        description="Isi formulir berikut untuk mengajukan proyek baru."
      />
      
      <div className="flex mb-4 w-full">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>
      </div>
      
      <div className="w-full max-w-8xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Form Pengajuan Projek
        </h2>

      {/* 3. Hubungkan form dengan fungsi handleSubmit */}
      <form onSubmit={handleSubmit}>
        <div className="w-full ">

          {/* 4. Hubungkan setiap input dengan state (name, value, onChange) */}
          <FormRow label="Nama Proyek">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </FormRow>

          <FormRow label="Deskripsi Proyek">
            <textarea
              rows="4"
              name="description"
              placeholder="Jelaskan masalah yang ingin diselesaikan dalam proyek ini"
              value={formData.description}
              onChange={handleChange}
              className={inputStyle}
              required
            ></textarea>
          </FormRow>

          <FormRow label="Kategori">
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className={inputStyle}
              required
            >
              <option value="" disabled>Pilih Kategori...</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Data Science">Data Science</option>
              <option value="UI/UX Design">UI/UX Design</option>
            </select>
          </FormRow>

          <FormRow label="Goals Projek">
            <input
              type="text"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className={inputStyle}
            />
          </FormRow>
          
          <FormRow label="Jumlah Orang">
            <select
              name="jumlahOrang"
              value={formData.jumlahOrang}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="" disabled>Pilih Jumlah Orang...</option>
              <option value="1 - 3 Orang">1 - 3 Orang</option>
              <option value="4 - 5 Orang">4 - 5 Orang</option>
              <option value="Lebih dari 5 Orang">Lebih dari 5 Orang</option>
            </select>
          </FormRow>

          <FormRow label="Informasi Tambahan">
            <textarea
              rows="3"
              name="infoTambahan"
              placeholder="Tambahan informasi seperti persyaratan khusus, teknologi yang diperlukan, dll."
              value={formData.infoTambahan}
              onChange={handleChange}
              className={inputStyle}
            ></textarea>
          </FormRow>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
            <button
              type="button" // type="button" agar tidak men-submit form
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 text-sm md:text-base font-semibold rounded-md hover:bg-gray-300 transition"
            >
              + Add another
            </button>
            <button
              type="submit" // type="submit" untuk menjalankan handleSubmit
              className="w-full sm:w-auto px-6 py-2 bg-secondary text-white text-sm md:text-base font-semibold rounded-md hover:bg-secondary/80 transition"
            >
              Submit Proyek
            </button>
          </div>
        </div>
      </form>
    </div>
    </>
  );
}