import { useState } from "react";
import PageTitle from "../../components/PageTitle";

const proposals = [
  {
    id: 1,
    mitra: "PT. Inovasi Digital Nusantara",
    judul: "Pengembangan aplikasi Pemetaan UMKM Berbasis Web",
    status: "Disetujui",
    tanggal: "18 April 2025",
  },
  {
    id: 2,
    mitra: "Dinas Lingkungan HidupKota",
    judul: "Platform E-Learning Interaktif untuk Anak Usia Dini",
    status: "Revisi",
    tanggal: "10 Mei 2025",
  },
  {
    id: 3,
    mitra: "CV. AgroTech Mandiri",
    judul: "Sistem Monitoring Tanaman Otomatis Berbasis IoT",
    status: "Menunggu",
    tanggal: "27 April 2025",
  },
  {
    id: 4,
    mitra: "Yayasan Rumah Pintar Anak",
    judul: "Platform E-Learning Interaktif untuk Anak Usia Dini",
    status: "Disetujui",
    tanggal: "14 Mei 2025",
  },
  {
    id: 5,
    mitra: "Komunitas Hijau Jakarta",
    judul: "Platform Edukasi Lingkungan dan Kampanye Digital",
    status: "Revisi",
    tanggal: "29 Mei 2025",
  },
];

const statusStyles = {
  Disetujui: "bg-[#70E947] text-white",
  Revisi: "bg-[#E94747] text-white",
  Menunggu: "bg-[#E4C900] text-white",
};

export default function ProposalPartner() {
  const [filter, setFilter] = useState("Semua");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [komentar, setKomentar] = useState("");
  const [reviewStatus, setReviewStatus] = useState("Review");

  const filtered =
    filter === "Semua"
      ? proposals
      : proposals.filter((p) => p.status === filter);

    const handleSubmit = (e) => {
    e.preventDefault();
    setKomentar("");
    setReviewStatus("Review");
    setSelectedProposal(null); 
  };
  return (
    <>
      <PageTitle
        title="Proposal Mitra"
        description="Evaluasi & bimbing proyek capstone mahasiswa"
      />
      <div className="flex flex-1 justify-center items-start flex-col px-4">
  <div className="bg-white rounded-xl shadow-md w-full p-6">
    <h1 className="text-2xl font-bold">Proposal Mitra</h1>
    <div className="mt-6 flex items-center gap-2 mb-6">
      <label className="text-sm font-semibold">Status</label>
      <select
        className="border rounded-lg px-2 py-1 text-sm bg-gray-300 text-[#1C1C1C]"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="Semua">Semua</option>
        <option value="Disetujui">Disetujui</option>
        <option value="Revisi">Revisi</option>
        <option value="Menunggu">Menunggu</option>
      </select>
    </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-2">No</th>
                  <th className="p-2">Nama Mitra</th>
                  <th className="p-2">Judul Proposal</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2 bg-[#E5ECF6]">{p.mitra}</td>
                    <td className="p-2 bg-[#E5ECF6]">{p.judul}</td>
                    <td className="p-2 text-center bg-[#E5ECF6]">
                      <span
                        className={`block w-full px-2 py-1 rounded-lg text-xs font-medium ${
                          statusStyles[p.status]
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2 text-center bg-[#E5ECF6]">
                      {p.tanggal}
                    </td>
                    <td className="p-2 text-center bg-[#E5ECF6]">
                      <button
                        onClick={() => setSelectedProposal(p)}
                        className="text-sm hover:underline"
                      >
                        detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedProposal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
                  onClick={() => setSelectedProposal(null)}
                >
                  ×
                </button>

                <h2 className="text-lg font-bold mb-4">Detail Proposal</h2>
                <p>
                  <strong>Nama Mitra:</strong> {selectedProposal.mitra}
                </p>
                <p>
                  <strong>Judul:</strong> {selectedProposal.judul}
                </p>
                <p>
                  <strong>Status:</strong> {selectedProposal.status}
                </p>
                <p>
                  <strong>Tanggal:</strong> {selectedProposal.tanggal}
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-2">
                  <textarea
                    placeholder="Komentar"
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    rows={3}
                  />
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="Review">Review</option>
                    <option value="Pending">Pending</option>
                    <option value="Approve">Approve</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                  >
                    Kirim Komentar
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
