import PageTitle from "../../components/PageTitle";
import { useState } from "react";


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

export default function ProposalPartner() {
  const [filter, setFilter] = useState("Semua");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [komentar, setKomentar] = useState("");
  const [reviewStatus, setReviewStatus] = useState("Review");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastKomentar, setLastKomentar] = useState("");
  const filtered =
    filter === "Semua"
      ? proposals
      : proposals.filter((p) => p.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLastKomentar(komentar);
    setKomentar("");
    setReviewStatus("Review");
    setSelectedProposal(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    };
  const statusStyles = {
  Disetujui: "bg-[#70E947] text-white",
  Revisi: "bg-[#E94747] text-white",
  Menunggu: "bg-[#E4C900] text-white",
  };
  return (
    <>
      <PageTitle
        title="Proposal Mitra"
        description="Evaluasi & bimbing proyek capstone mahasiswa"
      />
    <div className="h-full overflow-auto px-4 py-6">
      <div className="bg-white rounded-md shadow-md w-full p-6">
          <h1 className="text-2xl font-bold text-[#4F4F4F]">Proposal Mitra</h1>
          <div className="mt-6 flex items-center gap-2 mb-6">
            <label className="text-sm font-semibold">Status</label>
            <select
              className="border rounded-lg px-2 py-1 text-sm bg-[#BDBDBD] text-[#1C1C1C]"
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
                <tr className="text-[#424242]">
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
                    <td className="p-2 bg-[#E5ECF6] break-words max-w-xs">{p.judul}</td>
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
                <table className="w-full text-sm border-gray-300">
                  <tbody>
                    <tr>
                      <td className="py-2 font-semibold w-1/3 border-y">Nama Mitra</td>
                      <td className="py-2 border-y">{selectedProposal.mitra}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold border-y">Judul</td>
                      <td className="py-2 border-y">{selectedProposal.judul}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold border-y">Status</td>
                      <td className="py-2 border-y">{selectedProposal.status}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold border-y">Tanggal</td>
                      <td className="py-2 border-y">{selectedProposal.tanggal}</td>
                    </tr>
                  </tbody>
                </table>
                <form onSubmit={handleSubmit} className="mt-4 space-y-2">
                  <textarea
                    placeholder="Komentar"
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <select
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value)}
                      className="border rounded px-5 py-2 text-sm"
                    >
                      <option value="Review">Review</option>
                      <option value="Pending">Pending</option>
                      <option value="Approve">Approve</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-blue-600 justify-end text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                      Kirim Komentar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      {showSuccess && (
            <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded shadow-lg z-[9999] transition-opacity duration-300 text-sm space-y-1">
              <p>
                <strong>Komentar : </strong> {lastKomentar}
              </p>
              <p>Komentar anda telah dikirim</p>
            </div>
          )}
    </>
  );
}
