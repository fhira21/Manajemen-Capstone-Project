import React, { useState } from "react";
import pelamarData from "../../data/pelamar.json";

const DetailPelamar = () => {
  const [selectedProject, setSelectedProject] = useState(
    pelamarData[0].project
  );

  const [pelamarStatus, setPelamarStatus] = useState(
    pelamarData.reduce((acc, project) => {
      acc[project.project] = project.pelamar.map((p) => ({
        ...p,
        status: "pending", // Default status
      }));
      return acc;
    }, {})
  );

  const currentPelamar = pelamarStatus[selectedProject] || [];

  const handleAction = (projectName, pelamarId, action) => {
    setPelamarStatus((prev) => ({
      ...prev,
      [projectName]: prev[projectName].map((p) =>
        p.id === pelamarId ? { ...p, status: action } : p
      ),
    }));
  };

  return (
    <div className="flex justify-center bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen p-4 sm:p-6">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center sm:text-left text-gray-800">
          Detail Pelamar Proyek
        </h1>

        {/* Dropdown */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <select
            className="w-full sm:w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {pelamarData.map((p) => (
              <option key={p.project} value={p.project}>
                {p.project}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          {currentPelamar.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-100 to-blue-50">
                <tr>
                  <th className="px-4 py-3 text-gray-600 text-xs sm:text-sm font-semibold tracking-wide text-left">
                    No
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-xs sm:text-sm font-semibold tracking-wide text-left">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-xs sm:text-sm font-semibold tracking-wide text-left">
                    NIM
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-xs sm:text-sm font-semibold tracking-wide text-left">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-xs sm:text-sm font-semibold tracking-wide text-left">
                    Email
                  </th>
                  <th className="px-4 py-3 text-gray-600 text-xs sm:text-sm font-semibold tracking-wide text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPelamar.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.nim}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.email}
                    </td>
                    <td className="px-4 py-3 text-center space-y-2 sm:space-x-2 sm:space-y-0">
                      {item.status === "pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleAction(selectedProject, item.id, "accepted")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-3 py-1 rounded-lg shadow transition duration-200 w-full sm:w-auto"
                          >
                            Terima
                          </button>
                          <button
                            onClick={() =>
                              handleAction(selectedProject, item.id, "rejected")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm px-3 py-1 rounded-lg shadow transition duration-200 w-full sm:w-auto"
                          >
                            Tolak
                          </button>
                        </>
                      ) : (
                        <span
                          className={`inline-block px-3 py-1 text-xs sm:text-sm font-semibold rounded-full shadow ${
                            item.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status === "accepted"
                            ? "Diterima"
                            : "Ditolak"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Tidak ada pelamar untuk proyek ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPelamar;
