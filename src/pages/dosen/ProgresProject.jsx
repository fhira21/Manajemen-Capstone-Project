import { useMemo } from "react";
import PageTitle from "../../components/PageTitle";
import MAHASISWA from "../../data/mahasiswa.json";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = {
  onProgress: "#3B82F6", // biru
  done: "#22C55E",       // hijau
  submitted: "#FACC15",  // orange
  revision: "#EF4444",   // merah
};

export default function ProgresProject() {
  const statusMap = useMemo(() => {
    const statusArray = ["On Progress", "Done", "Submitted", "Revision"];
    return MAHASISWA.MAHASISWA.map((m, i) => ({
      ...m,
      projectName: `Proyek ${i + 1}`,
      status: statusArray[i % 4],
      progress: i % 4 === 0 ? "50%" : i % 4 === 1 ? "100%" : "Revisi",
      deadline: "10/05/2024",
      dosen: "Farid Surya",
    }));
  }, []);

  const chartCount = useMemo(() => {
    return {
      "On Progress": statusMap.filter((m) => m.status === "On Progress").length,
      "Done": statusMap.filter((m) => m.status === "Done").length,
      "Submitted": statusMap.filter((m) => m.status === "Submitted").length,
      "Revision": statusMap.filter((m) => m.status === "Revision").length,
    };
  }, [statusMap]);

  const chartData = {
    labels: ["On Progress", "Done", "Submitted", "Revision"],
    datasets: [
      {
        data: [
          chartCount["On Progress"],
          chartCount["Done"],
          chartCount["Submitted"],
          chartCount["Revision"],
        ],
        backgroundColor: [
          colors.onProgress,
          colors.done,
          colors.submitted,
          colors.revision,
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <PageTitle
        title="Manajemen Project"
        description="Evaluasi & bimbing proyek capstone mahasiswa"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-6">
        {/* Chart Section */}
        <div className="bg-white p-4 rounded-md shadow-md flex flex-col items-center">
          <Doughnut data={chartData} />
          <div className="mt-4 space-y-2 text-sm w-full">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full" /> On Progress
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full" /> Done
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full" /> Submitted
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full" /> Revision
            </div>
          </div>
        </div>

        {/* Cards */}
       <div className="col-span-1 lg:col-span-2 flex flex-col gap-2 justify-start">
  <div className="flex flex-col gap-2 w-full max-w-[200px]">
    <div className="bg-blue-500 text-white text-center py-1.5 px-3 rounded-md text-sm font-semibold shadow-sm">
      {chartCount["On Progress"]} Proyek Berjalan
    </div>
    <div className="bg-sky-300 text-white text-center py-1.5 px-3 rounded-md text-sm font-semibold shadow-sm">
      {chartCount["Done"]} Proyek Selesai
    </div>
    <div className="bg-yellow-200 text-black text-center py-1.5 px-3 rounded-md text-sm font-bold shadow-sm">
      {chartCount["Submitted"]} Proyek Belum Dimulai
    </div>
    <div className="bg-gray-400 text-white text-center py-1.5 px-3 rounded-md text-sm font-semibold shadow-sm">
      {chartCount["Revision"]} Proyek Belum Aktif
    </div>
  </div>
</div>


      </div>

      {/* Table Section */}
      <div className="p-6">
        <table className="w-full mt-6 bg-white rounded-md shadow-md overflow-hidden text-sm">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Nama Mahasiswa/Tim</th>
              <th className="px-4 py-3 text-left">Nama Proyek</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-left">Deadline</th>
              <th className="px-4 py-3 text-left">Dosen Pembimbing</th>
              <th className="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {statusMap.map((m, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{m.Nama}</td>
                <td className="px-4 py-2">{m.projectName}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                      m.status === "On Progress"
                        ? "bg-blue-500"
                        : m.status === "Done"
                        ? "bg-green-500"
                        : m.status === "Submitted"
                        ? "bg-yellow-400 text-black"
                        : "bg-red-500"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-2">{m.progress}</td>
                <td className="px-4 py-2">{m.deadline}</td>
                <td className="px-4 py-2">{m.dosen}</td>
                <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                  Lihat Detail
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
