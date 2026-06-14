import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const KelasTable = ({ data = [], onEdit, onDelete }) => {
  const { user } = useAuthStateContext();
  const canUpdate = user?.permission?.includes("kelas.update");
  const canDelete = user?.permission?.includes("kelas.delete");

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">Nama Kelas</th>
          <th className="py-2 px-4 text-left">Mata Kuliah</th>
          <th className="py-2 px-4 text-left">Dosen Pengampu</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((kls, index) => (
          <tr key={kls.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
            <td className="py-2 px-4 font-semibold">{kls.nama}</td>
            <td className="py-2 px-4">{kls.mataKuliahNama}</td>
            <td className="py-2 px-4">{kls.dosenNama}</td>
            <td className="py-2 px-4 text-center space-x-2">
              {canUpdate && (
                <Button size="sm" variant="warning" onClick={() => onEdit(kls)}>
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button size="sm" variant="danger" onClick={() => onDelete(kls.id)}>
                  Hapus
                </Button>
              )}
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan="4" className="py-4 text-center text-gray-500">
              Tidak ada data kelas
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default KelasTable;
