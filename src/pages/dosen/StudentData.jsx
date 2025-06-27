import PageTitle from "../../components/PageTitle";
import MAHASISWA from "../../data/mahasiswa.json";

export default function DataMahasiswa() {
  return (
    <>
      <PageTitle
        title="Data Mahasiswa"
        description="Configure your application settings, manage preferences, and customize your experience. This section allows you to adjust various options to suit your needs."
      />
      <div className="h-full overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4 bg-white py-2 px-2 rounded-lg">Data Mahasiswa</h2>

        <div className="flex justify-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {MAHASISWA.MAHASISWA.map((m) => (
              <div
                key={m.ID_Mahasiswa}
                className="border p-4 rounded-md shadow bg-white space-y-1"
              >
                <img
                  src={m.Foto_Profile}
                  alt={m.Nama}
                  className="w-full aspect-square object-cover rounded-lg"
                />

                <div className="flex items-center gap-1 text-xs">
                  <p>No. Telp:</p>
                  <p>{m.No_Telepon}</p>
                </div>      

                <div>
                  <p className="font-semibold text-lg text-primary">{m.Nama}</p>
                  <p className="text-md">
                    Mahasiswa Sistem Informasi, Universitas Ahmad Dahlan
                    <br />
                    NIM : {m.NIM}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <img
                    className="w-3 h-3"
                    src="/assets/icons/icons8-Location-90.png"
                    alt="Location icon"
                  />
                  <span>{m.Alamat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
