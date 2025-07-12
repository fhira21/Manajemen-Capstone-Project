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
        Status: "Disetujui", // langsung disetujui
        "Tanggal Daftar": new Date().toISOString().split("T")[0],
      },
    ]);

    // langsung ubah status verifikasi jadi Disetujui
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
        <div className="bg-white rounded-md shadow-md w-full p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Informasi Proposal
          </h2>
          <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
            <div className="font-medium">Judul</div>
            <div>{selectedProposal.Judul_Project}</div>

            <div className="font-medium">Nama Mitra</div>
            <div>{getNamaMitra(selectedProposal.ID_Mitra)}</div>

            <div className="font-medium">Kategori</div>
            <div>{selectedProposal.Kategori_Project.join(", ")}</div>

            <div className="font-medium">Masalah</div>
            <div>{selectedProposal.Deskripsi_Masalah}</div>

            <div className="font-medium">Goals</div>
            <div>{selectedProposal.Goals}</div>

            <div className="font-medium">Jumlah Orang</div>
            <div>{selectedProposal.Jumlah_orang}</div>

            <div className="font-medium">Tanggal</div>
            <div>{selectedProposal.tanggal}</div>

            <div className="font-medium">Status</div>
            <div>{selectedProposal.status}</div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Mahasiswa Pendaftar
            </h3>
            <button
              onClick={handleTambahMahasiswa}
              className="px-3 py-1 text-sm rounded bg-green-600 hover:bg-green-700 text-white"
            >
              Tambah Mahasiswa
            </button>
          </div>

          {showTambah && (
            <div className="border p-4 mb-4 rounded bg-gray-50">
              <h4 className="text-md font-semibold mb-2">
                Pilih Mahasiswa untuk Ditambahkan
              </h4>
              <ul className="grid grid-cols-2 gap-2 max-h-64 overflow-auto">
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
                      className={`px-2 py-1 rounded text-sm text-white ${
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
            <table className="min-w-full text-sm border mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">No</th>
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">Tanggal Daftar</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {pendaftarProposal.map((mhs, index) => {
                  const currentStatus =
                    statusVerifikasi[mhs.ID_PENDAFTAR] || mhs.Status;

                  return (
                    <tr key={mhs.ID_PENDAFTAR}>
                      <td className="p-2 border text-center">{index + 1}</td>
                      <td className="p-2 border">{mhs.Nama}</td>
                      <td className="p-2 border">{mhs["Tanggal Daftar"]}</td>
                      <td className="p-2 border">{mhs.Status}</td>
                      <td className="p-2 border text-center">
                        <button
                          onClick={() => toggleStatus(mhs.ID_PENDAFTAR)}
                          className={`px-2 py-1 rounded text-white text-xs ${
                            currentStatus === "Disetujui"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : currentStatus === "Ditolak"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-gray-400 hover:bg-gray-500"
                          }`}
                        >
                          {currentStatus}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-600">
              Belum ada mahasiswa yang mendaftar.
            </p>
          )}

          <div className="mt-6">
            <button
              onClick={() => setSelectedProposal(null)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded text-sm"
            >
              Kembali ke Daftar Proposal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Halaman utama daftar proposal
  return (
    <>
      <PageTitle
        title="Daftar Proposal Diterima"
        description="Daftar semua proposal yang telah disetujui untuk dikerjakan mahasiswa."
      />
      <div className="h-full overflow-auto px-4 py-6">
        <div className="bg-white rounded-md shadow-md w-full p-6">
          <h1 className="text-2xl font-bold text-[#4F4F4F]">
            Proposal Diterima
          </h1>
          <div className="my-5">
            <table className="min-w-full text-sm border-collapse">
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
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
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
