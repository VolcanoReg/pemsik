import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { getDosen } from "@/Utils/Apis/DosenApi";

const DosenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dosen, setDosen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDosen(id);
  }, [id]);

  const fetchDosen = async (id) => {
    try {
      const res = await getDosen(id);
      setDosen(res.data);
    } catch (err) {
      toastError("Gagal mengambil data dosen: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-8">Memuat data...</p>;
  if (!dosen) return <p className="text-center text-red-500 mt-8">Data dosen tidak ditemukan.</p>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <Heading as="h2" className="mb-6 text-left">Detail Dosen</Heading>
      
      <div className="space-y-4 text-gray-700">
        <div>
          <strong className="block text-sm font-medium text-gray-500">NIDN</strong>
          <p className="text-lg">{dosen.nidn}</p>
        </div>
        <div>
          <strong className="block text-sm font-medium text-gray-500">Nama</strong>
          <p className="text-lg">{dosen.nama}</p>
        </div>
        {/* Tambahkan field detail lainnya sesuai struktur database Anda di sini */}
      </div>

      <div className="mt-8">
        <Button onClick={() => navigate(-1)} variant="secondary">
          Kembali
        </Button>
      </div>
    </Card>
  );
};

export default DosenDetail;
