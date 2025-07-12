import { useMemo } from "react";
import PageTitle from "../../components/PageTitle";
import MAHASISWA from "../../data/mahasiswa.json";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = {
  onProgress: "#3B82F6", // biru
  done: "#22C55E", // hijau
  submitted: "#FACC15", // orange
  revision: "#EF4444", // merah
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
      Done: statusMap.filter((m) => m.status === "Done").length,
      Submitted: statusMap.filter((m) => m.status === "Submitted").length,
      Revision: statusMap.filter((m) => m.status === "Revision").length,
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
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: {
        display: false, // Nonaktifkan legend/label di atas chart
      },
    },
  };

  return (
    <>
      <PageTitle
        title="Manajemen Project"
        description="Evaluasi & bimbing proyek capstone mahasiswa"
      />
      <div className="w-full px-4 flex justify-center">
        <div className="bg-white p-4 sm:p-6 rounded-md shadow-md w-full max-w-6xl grid gap-6 md:grid-cols-2">
          {/* Chart */}
          <div className="w-full flex justify-center">
            <div className="w-[200px] sm:w-[250px] h-[200px]">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Count dan Legend */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <div className="bg-blue-500 text-white text-center py-1.5 px-3 rounded text-xs font-semibold shadow">
                {chartCount["On Progress"]} Proyek Berjalan
              </div>
              <div className="bg-sky-300 text-white text-center py-1.5 px-3 rounded text-xs font-semibold shadow">
                {chartCount["Done"]} Proyek Selesai
              </div>
              <div className="bg-yellow-200 text-black text-center py-1.5 px-3 rounded text-xs font-semibold shadow">
                {chartCount["Submitted"]} Proyek Belum Dimulai
              </div>
              <div className="bg-gray-400 text-white text-center py-1.5 px-3 rounded text-xs font-semibold shadow">
                {chartCount["Revision"]} Proyek Revisi
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs justify-start sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full" />
                On Progress
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                Done
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                Submitted
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                Revision
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statusMap.map((m, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-md shadow text-xs space-y-1"
            >
              <p className="font-bold">{m.Nama}</p>
              <p className="text-gray-700">Proyek: {m.projectName}</p>
              <div
                className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${
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
              </div>
              <p className="text-gray-700">Progress: {m.progress}</p>
              <p className="text-gray-700">Deadline: {m.deadline}</p>
              <p className="text-gray-700">Dosen: {m.dosen}</p>
              <p className="text-blue-600 hover:underline cursor-pointer">
                Lihat Detail
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
