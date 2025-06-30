import PageTitle from "../components/PageTitle";
import { useState } from "react";
import PENDAFTAR from "../data/Pendaftar(dosen).json";

export default function ListStudentRegister() {
  const [jomblo, kasihpacar] = useState("");
  const [Pendaftar] = useState(PENDAFTAR.PENDFTAR);
  const [filter, setFilter] = useState("");

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
    Revisi: "bg-[#E94747] text-white",
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
                jomblo === "revisi"
                  ? "bg-[#E94747] text-white"
                  : "hover:bg-[#E94747]"
              }`}
              onClick={() => handleClick("Revisi")}
            >
              <button> Revisi </button>
            </div>
            <div
              className={`py-2 px-2 rounded-2xl shadow-xl ${
                jomblo === "menunggu"
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
                  <th className="p-2">No</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Proyek</th>
                  <th className="p-2">Tanggal Daftar</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p.ID} className="hover:bg-gray-50">
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2 break-words max-w-xs">{p.Nama}</td>
                    <td className="p-2 break-words max-w-xs">{p.Proyek}</td>
                    <td className="p-2 break-words max-w-xs">
                      {p["Tanggal Daftar"]}
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          statusStyles[p.status] || ""
                        }`}
                      >
                        {p.Status}
                      </span>
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
