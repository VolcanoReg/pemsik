import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import { getMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import { mahasiswaList } from "@/Data/Dummy";
import { useParams } from "react-router-dom";

const MahasiswaDetail = () => {
  const path = window.location.pathname;
  //const { nim } = useParams();
  //
  //const mahasiswa = mahasiswaList.find((m) => m.nim === nim);
  //
  //if (!mahasiswa) {
  //  return <p className="text-red-600">Data mahasiswa tidak ditemukan.</p>;
  //}

  const { id } = useParams();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMahasiswa();
  }, [id]);

  const fetchMahasiswa = async () => {
    try {
      const res = await getMahasiswa(id);
      setMahasiswa(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mahasiswa: ", err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <p className="text-center">Memuat data...</p>;

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">
        Detail Mahasiswa
      </Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">NIM</td>
            <td className="py-2 px-4">{mahasiswa.nim}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{mahasiswa.nama}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MahasiswaDetail;
