import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Akses Ditolak
      </h2>
      <p className="text-gray-600 mb-6">
        Maaf, Anda tidak memiliki hak akses untuk membuka halaman ini.
      </p>
      <Link
        to="/admin/dashboard"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
