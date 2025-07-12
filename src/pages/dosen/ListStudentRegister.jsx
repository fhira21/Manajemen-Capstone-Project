import PageTitle from "../../components/PageTitle";
import { useState } from "react";
import PROPOSAL from "../../data/proposal.json";
import MITRA from "../../data/mitra.json";
import PENDAFTAR from "../../data/Pendaftar(dosen).json";
import MAHASISWA from "../../data/mahasiswa.json";

export default function ListStudentRegister() {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [statusVerifikasi, setStatusVerifikasi] = useState({});
  const [pendaftarBaru, setPendaftarBaru] = useState([]);
  const [showTambah, setShowTambah] = useState(false);

  const acceptedProposals = PROPOSAL.PROPOSAL.filter(
    (p) => p.status === "Disetujui"
  );

  const getNamaMitra = (idMitra) => {
    const mitra = MITRA.MITRA.find((m) => m.ID_Mitra === idMitra);
    return mitra ? mitra.Nama_Perusahaan : "Tidak ditemukan";
  };

  const toggleStatus = (idPendaftar) => {
    setStatusVerifikasi((prev) => {
      const current = prev[idPendaftar] || "Menunggu";
      const next = current === "Disetujui" ? "Ditolak" : "Disetujui";
      return {
        ...prev,
        [idPendaftar]: next,
      };
    });
  };

  const handleTambahMahasiswa = () => {
    setShowTambah(true);
  };

  const tambahMahasiswaKeProposal = (mhs) => {
    const newId = `NEW-${Date.now()}`;

    setPendaftarBaru((prev) => [
      ...prev,
      {
        ...mhs,
        ID_Proposal: selectedProposal.ID_Proposal,
        ID_PENDAFTAR: newId,
        Status: "Disetujui",
        "Tanggal Daftar": new Date().toISOString().split("T")[0],
      },
    ]);

    setStatusVerifikasi((prev) => ({
      ...prev,
      [newId]: "Disetujui",
    }));

    setShowTambah(false);
  };

  if (selectedProposal) {
    const pendaftarProposal = [
      ...PENDAFTAR.PENDFTAR.filter(
        (mhs) => mhs.ID_Proposal === selectedProposal.ID_Proposal
      ),
      ...pendaftarBaru,
    ];

    return (
      <div className="h-full overflow-auto px-4 py-6">
        <PageTitle
          title="Detail Proposal"
          description={`Informasi detail dan daftar mahasiswa yang mendaftar untuk proyek "${selectedProposal.Judul_Project}".`}
        />
        <div className="bg-white rounded-md shadow-md w-full p-3 sm:p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Mahasiswa Pendaftar
            </h3>
            <button
              onClick={handleTambahMahasiswa}
              className="px-2 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white"
            >
              Tambah
            </button>
          </div>

          {showTambah && (
            <div className="border p-2 sm:p-3 mb-4 rounded bg-gray-50">
              <h4 className="text-xs font-semibold mb-2">Pilih Mahasiswa</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-auto text-xs">
                {MAHASISWA.MAHASISWA.map((mhs) => (
                  <li
                    key={mhs.ID_Mahasiswa}
                    className="flex items-center justify-between p-2 border rounded bg-white shadow-sm"
                  >
                    <span>
                      {mhs.Nama} ({mhs.NIM})
                    </span>
                    <button
                      onClick={() => tambahMahasiswaKeProposal(mhs)}
                      disabled={pendaftarProposal.some(
                        (p) => p.ID_Mahasiswa === mhs.ID_Mahasiswa
                      )}
                      className={`px-2 py-1 rounded text-xs text-white ${
                        pendaftarProposal.some(
                          (p) => p.ID_Mahasiswa === mhs.ID_Mahasiswa
                        )
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Tambah
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pendaftarProposal.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {pendaftarProposal.map((mhs, index) => {
                const currentStatus =
                  statusVerifikasi[mhs.ID_PENDAFTAR] || mhs.Status;

                return (
                  <div
                    key={mhs.ID_PENDAFTAR}
                    className="border rounded p-3 text-xs shadow"
                  >
                    <p className="font-semibold mb-1">
                      #{index + 1} - {mhs.Nama}
                    </p>
                    <p className="text-gray-600">
                      Tanggal: {mhs["Tanggal Daftar"]}
                    </p>
                    <p className="text-gray-600">Status: {mhs.Status}</p>
                    <p className="mt-2">Verifikasi:</p>
                    <button
                      onClick={() => toggleStatus(mhs.ID_PENDAFTAR)}
                      className={`px-2 py-1 rounded text-white mt-1 ${
                        currentStatus === "Disetujui"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : currentStatus === "Ditolak"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-400 hover:bg-gray-500"
                      }`}
                    >
                      {currentStatus}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-600">
              Belum ada mahasiswa yang mendaftar.
            </p>
          )}

          <div className="mt-5">
            <button
              onClick={() => setSelectedProposal(null)}
              className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-white rounded text-xs"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title="Daftar Proposal Diterima"
        description="Proposal yang telah disetujui untuk dikerjakan."
      />
      <div className="h-full overflow-auto px-4 py-6">
        <div className="bg-white rounded-md shadow-md w-full p-3 sm:p-4">
          <h1 className="text-lg font-bold text-[#4F4F4F] mb-3">
            Proposal Diterima
          </h1>
          <div className="grid gap-3 md:hidden">
            {acceptedProposals.map((p, idx) => (
              <div
                key={p.ID_Proposal}
                className="bg-[#E5ECF6] p-3 rounded shadow text-xs space-y-2"
              >
                <p className="font-semibold text-gray-600">No: {idx + 1}</p>
                <p className="font-bold">{getNamaMitra(p.ID_Mitra)}</p>
                <p className="font-bold">{p.Judul_Project}</p>
                <p className="text-gray-600">Tanggal: {p.tanggal}</p>
                <p>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded inline-block">
                    {p.status}
                  </span>
                </p>
                <button
                  onClick={() => setSelectedProposal(p)}
                  className="px-3 py-1 rounded bg-secondary hover:bg-blue-700 text-white text-xs"
                >
                  Detail
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="text-[#424242] text-left">
                  <th className="p-2 text-center">No</th>
                  <th className="p-2">Nama Mitra</th>
                  <th className="p-2">Proyek</th>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {acceptedProposals.map((p, idx) => (
                  <tr key={p.ID_Proposal} className="hover:bg-gray-50">
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2 break-words max-w-xs">
                      {getNamaMitra(p.ID_Mitra)}
                    </td>
                    <td className="p-2 break-words max-w-xs">
                      {p.Judul_Project}
                    </td>
                    <td className="p-2">{p.tanggal}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => setSelectedProposal(p)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
