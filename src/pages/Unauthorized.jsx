export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
        <p className="text-lg">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    </div>
  );
}