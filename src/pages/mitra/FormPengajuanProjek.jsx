import React from 'react';

// Komponen untuk setiap baris input agar lebih rapi
const FormRow = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2">
      {label}
    </label>
    {children}
  </div>
);

export default function FormPengajuanProjek() {
  const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Form Pengajuan Projek
      </h1>

      <form>
        <div className="max-w-2xl">
          <FormRow label="Nama Proyek">
            <input
              type="text"
              className={inputStyle}
            />
          </FormRow>

          <FormRow label="Deksripsi Proyek">
            <textarea
              rows="3"
              className={inputStyle}
            ></textarea>
          </FormRow>

          <FormRow label="Kategori">
            <select className={inputStyle}>
              <option>Pilih Kategori...</option>
              <option>Web Development</option>
              <option>Mobile Development</option>
              <option>Data Science</option>
              <option>UI/UX Design</option>
            </select>
          </FormRow>

          <FormRow label="Goals Projek">
            <input
              type="text"
              className={inputStyle}
            />
          </FormRow>
          
          <FormRow label="Jumlah Orang">
             <select className={inputStyle}>
              <option>Pilih Jumlah Orang...</option>
              <option>1 - 3 Orang</option>
              <option>4 - 5 Orang</option>
              <option>Lebih dari 5 Orang</option>
            </select>
          </FormRow>

          <FormRow label="Informasi Tambahan">
            <textarea
              className={inputStyle}
            ></textarea>
          </FormRow>

          <div className="flex items-center mt-8">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
            >
              + Add another
            </button>
            <button
              type="submit"
              className="ml-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Add Proyek
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}