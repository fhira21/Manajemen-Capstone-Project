import { useState } from "react";
import PageTitle from "../../components/PageTitle";
import MAHASISWA from "../../data/mahasiswa.json";

export default function DataMahasiswa() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <>
      <PageTitle
        title="Data Mahasiswa"
        description="Configure your application settings, manage preferences, and customize your experience. This section allows you to adjust various options to suit your needs."
      />
      <div className="h-full overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4 bg-white py-2 px-2 rounded-lg">
          Data Mahasiswa
        </h2>

        <div className="flex justify-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {MAHASISWA.MAHASISWA.map((m) => (
              <div
                key={m.ID_Mahasiswa}
                className="border p-4 rounded-md shadow bg-white space-y-2"
              >
                <img
                  src={m.Foto_Profile}
                  alt={m.Nama}
                  className="w-full aspect-square object-cover rounded-lg"
                />

                <div>
                  <p className="font-semibold text-lg text-primary">{m.Nama}</p>
                  <p className="text-sm">
                    Mahasiswa Sistem Informasi, Universitas Ahmad Dahlan
                    <br />
                    NIM : {m.NIM}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <img
                      className="w-3 h-3"
                      src="/assets/icons/icons8-Location-90.png"
                      alt="Location icon"
                    />
                    <span>{m.Alamat}</span>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(m)}
                    className="text-primary hover:underline"
                  >
                    More..
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-xs relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setSelectedStudent(null)}
            >
              ×
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedStudent.Foto_Profile}
                alt={selectedStudent.Nama}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-bold">{selectedStudent.Nama}</p>
                <p className="text-sm text-gray-600">
                  NIM: {selectedStudent.NIM}
                </p>
              </div>
            </div>

            <div className="text-sm space-y-3">
              <p>
                <strong>Jenis Kelamin:</strong> {selectedStudent.Jenis_Kelamin}
              </p>
              <p>
                <strong>No. Telepon:</strong> {selectedStudent.No_Telepon}
              </p>
              <p>
                <strong>Alamat:</strong> {selectedStudent.Alamat}
              </p>
              <p>
                <strong>ID User:</strong> {selectedStudent.ID_User}
              </p>
              <p>
                <strong>ID CV:</strong> {selectedStudent.ID_CV}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
