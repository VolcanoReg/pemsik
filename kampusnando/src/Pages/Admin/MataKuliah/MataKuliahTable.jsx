import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MataKuliahTable = ({ data = [], onEdit, onDelete }) => {
  const { user } = useAuthStateContext();
  const canUpdate = user?.permission?.includes("matakuliah.update");
  const canDelete = user?.permission?.includes("matakuliah.delete");

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">Kode MK</th>
          <th className="py-2 px-4 text-left">Nama Mata Kuliah</th>
          <th className="py-2 px-4 text-left">SKS</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mk, index) => (
          <tr key={mk.kode} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
            <td className="py-2 px-4 font-semibold">{mk.kode}</td>
            <td className="py-2 px-4">{mk.nama}</td>
            <td className="py-2 px-4">{mk.sks} SKS</td>
            <td className="py-2 px-4 text-center space-x-2">
              {canUpdate && (
                <Button size="sm" variant="warning" onClick={() => onEdit(mk)}>
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button size="sm" variant="danger" onClick={() => onDelete(mk.id)}>
                  Hapus
                </Button>
              )}
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan="4" className="py-4 text-center text-gray-500">
              Tidak ada data mata kuliah
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MataKuliahTable;
