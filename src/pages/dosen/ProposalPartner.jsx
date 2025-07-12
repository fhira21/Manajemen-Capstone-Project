import { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import PROPOSAL from "../../data/proposal.json";
import MITRA from "../../data/mitra.json";

export default function ProposalPartner() {
  const handleStatusOnlySubmit = () => {
    const updatedProposals = proposals.map((p) =>
      p.ID_Proposal === selectedProposal.ID_Proposal
        ? { ...p, status: reviewStatus }
        : p
    );

    setProposals(updatedProposals);
    setSelectedProposal(null);
  };

  const [filter, setFilter] = useState("Semua");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [komentar, setKomentar] = useState("");
  const [reviewStatus, setReviewStatus] = useState("Menunggu");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastKomentar, setLastKomentar] = useState("");

  const [proposals, setProposals] = useState(PROPOSAL.PROPOSAL);

  const filtered =
    filter === "Semua"
      ? proposals
      : proposals.filter((p) => p.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (komentar.trim() === "") {
      alert("Komentar tidak boleh kosong!");
      return;
    }

    const updatedProposals = proposals.map((p) =>
      p.ID_Proposal === selectedProposal.ID_Proposal
        ? { ...p, status: reviewStatus }
        : p
    );

    setProposals(updatedProposals);
    setLastKomentar(komentar);
    setKomentar("");
    setSelectedProposal(null);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const statusStyles = {
    Disetujui: "bg-[#70E947] text-white",
    Revisi: "bg-[#E94747] text-white",
    Menunggu: "bg-[#E4C900] text-white",
  };

  const getMitra = (idMitra) => {
    return MITRA.MITRA.find((m) => m.ID_Mitra === idMitra);
  };

  useEffect(() => {
    if (selectedProposal) {
      setKomentar("");
      setReviewStatus(selectedProposal.status);
    }
  }, [selectedProposal]);

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
                <tr className="text-[#424242] text-left">
                  <th className="p-2">No</th>
                  <th className="p-2">Nama Mitra</th>
                  <th className="p-2">Judul Proposal</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Tanggal</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p.ID_Proposal} className="hover:bg-gray-50">
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2 bg-[#E5ECF6]">
                      {getMitra(p.ID_Mitra)?.Nama_Perusahaan ||
                        "Tidak Diketahui"}
                    </td>
                    <td className="p-2 bg-[#E5ECF6] break-words max-w-xs">
                      {p.Judul_Project}
                    </td>
                    <td className="p-2 text-center bg-[#E5ECF6]">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          statusStyles[p.status] || ""
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
                        className="px-3 py-1 rounded bg-secondary hover:bg-blue-700 text-white text-sm"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedProposal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
                  onClick={() => setSelectedProposal(null)}
                >
                  ×
                </button>

                <h2 className="text-lg font-bold mb-4">Detail Proposal</h2>

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={getMitra(selectedProposal.ID_Mitra)?.Foto_Profile}
                    alt="Foto Mitra"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-sm">
                      {getMitra(selectedProposal.ID_Mitra)?.Nama_Perusahaan}
                    </p>
                    <p className="text-xs text-gray-600">
                      {getMitra(selectedProposal.ID_Mitra)?.No_Telepon}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="font-semibold text-[#4F4F4F]">Judul</div>
                  <div>{selectedProposal.Judul_Project}</div>

                  <div className="font-semibold text-[#4F4F4F]">Kategori</div>
                  <div>{selectedProposal.Kategori_Project.join(", ")}</div>

                  <div className="font-semibold text-[#4F4F4F]">
                    Deskripsi Masalah
                  </div>
                  <div>{selectedProposal.Deskripsi_Masalah}</div>

                  <div className="font-semibold text-[#4F4F4F]">Goals</div>
                  <div>{selectedProposal.Goals}</div>

                  <div className="font-semibold text-[#4F4F4F]">
                    Jumlah Orang
                  </div>
                  <div>{selectedProposal.Jumlah_orang}</div>

                  <div className="font-semibold text-[#4F4F4F]">
                    Informasi Tambahan
                  </div>
                  <div>{selectedProposal.Informasi_Tambahan}</div>

                  <div className="font-semibold text-[#4F4F4F]">Status</div>
                  <div>{selectedProposal.status}</div>

                  <div className="font-semibold text-[#4F4F4F]">
                    Tanggal Masuk
                  </div>
                  <div>{selectedProposal.tanggal}</div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-2">
                  <textarea
                    placeholder="Komentar"
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-between items-center gap-2">
                    <select
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value)}
                      className="border rounded px-5 py-2 text-sm"
                    >
                      <option value="Revisi">Revisi</option>
                      <option value="Menunggu">Menunggu</option>
                      <option value="Disetujui">Disetujui</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={komentar.trim() === ""}
                        className={`px-3 py-2 rounded text-white ${
                          komentar.trim() === ""
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        Kirim Komentar
                      </button>
                      <button
                        type="button"
                        onClick={handleStatusOnlySubmit}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        Submit
                      </button>
                    </div>
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
