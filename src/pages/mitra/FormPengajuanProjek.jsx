import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Komponen helper ini sudah benar, tidak perlu diubah.
const FormRow = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2">
      {label}
    </label>
    {children}
  </div>
);

export default function FormPengajuanProjek({ onAddProject }) {
  const navigate = useNavigate();
  
  // 1. Definisikan style untuk input agar bisa dipakai ulang
  const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  
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

  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Form Pengajuan Projek
      </h1>

      {/* 3. Hubungkan form dengan fungsi handleSubmit */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">

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
              rows="3"
              name="description"
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
              name="infoTambahan"
              value={formData.infoTambahan}
              onChange={handleChange}
              className={inputStyle}
            ></textarea>
          </FormRow>

          <div className="flex items-center mt-8">
            <button
              type="button" // type="button" agar tidak men-submit form
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
            >
              + Add another
            </button>
            <button
              type="submit" // type="submit" untuk menjalankan handleSubmit
              className="ml-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Add Proyek
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}