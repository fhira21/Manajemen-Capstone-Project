import PageTitle from "../components/PageTitle";
import { useState } from "react";
import PENDAFTAR from "../data/Pendaftar(dosen).json";

export default function ListStudentRegister() {
  const [jomblo, kasihpacar] = useState("");
  const [Pendaftar, setPendaftar] = useState(PENDAFTAR.PENDFTAR);
  const [filter, setFilter] = useState("");
  const [selectedpendaftar, setselectedpendaftar] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("");

  const handleStatusOnlySubmit = () => {
    const updated = Pendaftar.map((p) =>
      p.ID_PENDAFTAR === selectedpendaftar.ID_PENDAFTAR
        ? { ...p, Status: selectedpendaftar.Status }
        : p
    );
    setPendaftar(updated);
    setselectedpendaftar(null);
  };

  const filtered = filter
    ? Pendaftar.filter((p) => p.Status === filter)
    : Pendaftar;

  const handleClick = (status) => {
    if (filter === status) {
      kasihpacar("");
      setFilter("");
    } else {
      kasihpacar(status);
      setFilter(status);
    }
  };

  const statusStyles = {
    Disetujui: "bg-[#70E947] text-white",
    Menunggu: "bg-[#E4C900] text-white",
  };

  return (
    <>
      <PageTitle
        title="Mahasiswa Pendaftar"
        description="Configure your application settings, manage preferences, and customize your experience. This section allows you to adjust various options to suit your needs."
      />
      <div className="h-full overflow-auto px-4 py-6">
        <div className="bg-white rounded-md shadow-md w-full p-6">
          <h1 className="text-2xl font-bold text-[#4F4F4F]">
            Manajemen Pendaftar
          </h1>
          <div className="flex justify-start gap-2 text-[#4F4F4F] mt-10">
            <div
              className={`py-2 px-2 rounded-2xl shadow-xl ${
                jomblo === "Disetujui"
                  ? "bg-[#70E947] text-white"
                  : "hover:bg-[#70E947]"
              }`}
              onClick={() => handleClick("Disetujui")}
            >
              <button> Disetujui </button>
            </div>
            <div
              className={`py-2 px-2 rounded-2xl shadow-xl ${
                jomblo === "Menunggu"
                  ? "bg-[#E4C900] text-white"
                  : "hover:bg-[#E4C900]"
              }`}
              onClick={() => handleClick("Menunggu")}
            >
              <button> Menunggu </button>
            </div>
          </div>
          <div className="my-5">
            <table className="min-w-full text-sm border-collapse ">
              <thead>
                <tr className="text-[#424242] text-left">
                  <th className="p-2 text-center">No</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Proyek</th>
                  <th className="p-2">Tanggal Daftar</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p.ID_PENDAFTAR} className="hover:bg-gray-50">
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2 break-words max-w-xs">{p.Nama}</td>
                    <td className="p-2 break-words max-w-xs">{p.Proyek}</td>
                    <td className="p-2 break-words max-w-xs">
                      {p["Tanggal Daftar"]}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => {
                          setselectedpendaftar(p);
                          setReviewStatus(p.Status);
                        }}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          statusStyles[p.Status] || ""
                        }`}
                      >
                        {p.Status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedpendaftar && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
                onClick={() => setselectedpendaftar(null)}
              >
                ×
              </button>

              <h2 className="text-lg font-bold mb-4">Detail Pendaftar</h2>

              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="font-semibold">Nama</div>
                <div>{selectedpendaftar.Nama}</div>

                <div className="font-semibold">Proyek</div>
                <div>{selectedpendaftar.Proyek}</div>

                <div className="font-semibold">Tanggal Daftar</div>
                <div>{selectedpendaftar["Tanggal Daftar"]}</div>

                <div className="font-semibold">Status</div>
                <div>{selectedpendaftar.Status}</div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <select
                  value={selectedpendaftar.Status}
                  onChange={(e) =>
                    setselectedpendaftar({
                      ...selectedpendaftar,
                      Status: e.target.value,
                    })
                  }
                  className="border rounded px-4 py-1 text-sm"
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Disetujui">Disetujui</option>
                </select>
                <button
                  onClick={handleStatusOnlySubmit}
                  className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
