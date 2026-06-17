import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const KelasTable = ({
  data = [],
  kelasFull = [],
  mahasiswa = [],
  dosen = [],
  mataKuliah = [],
  selectedMhs = {},
  setSelectedMhs,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuthStateContext();
  const canUpdate = user?.permission?.includes("kelas.update");
  const canDelete = user?.permission?.includes("kelas.delete");

  const calculateDosenLoad = (dsnId) => {
    if (!dsnId) return 0;
    return kelasFull
      .filter((k) => String(k.dosen_id || k.dosenId) === String(dsnId))
      .reduce((sum, k) => {
        const mk = mataKuliah.find((m) => String(m.id) === String(k.mata_kuliah_id || k.matakuliahId));
        return sum + (mk?.sks || 0);
      }, 0);
  };

  const calculateStudentLoad = (mhsId) => {
    if (!mhsId) return 0;
    return kelasFull
      .filter((k) => (k.mahasiswa_ids || []).map(String).includes(String(mhsId)))
      .reduce((sum, k) => {
        const mk = mataKuliah.find((m) => String(m.id) === String(k.mata_kuliah_id || k.matakuliahId));
        return sum + (mk?.sks || 0);
      }, 0);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 border border-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold border-b">Nama Kelas</th>
            <th className="py-3 px-4 text-left font-semibold border-b">Mata Kuliah</th>
            <th className="py-3 px-4 text-left font-semibold border-b">Dosen Pengampu</th>
            <th className="py-3 px-4 text-left font-semibold border-b">Daftar Mahasiswa (SKS)</th>
            <th className="py-3 px-4 text-center font-semibold border-b w-36">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((kls, index) => {
            const currentDosen = dosen.find((d) => String(d.id) === String(kls.dosenId || kls.dosen_id));
            const dosenLoad = calculateDosenLoad(kls.dosenId || kls.dosen_id);
            const dosenMax = currentDosen?.max_sks || 12;

            return (
              <tr key={kls.id} className={index % 2 === 0 ? "bg-white hover:bg-gray-50 transition" : "bg-gray-50 hover:bg-gray-100 transition"}>
                {/* 1. Nama Kelas */}
                <td className="py-3 px-4 font-semibold border-r border-gray-100">{kls.nama}</td>

                {/* 2. Mata Kuliah */}
                <td className="py-3 px-4 border-r border-gray-100">{kls.mataKuliahNama}</td>

                {/* 3. Dosen Pengampu */}
                <td className="py-3 px-4 border-r border-gray-100">
                  <div className="font-semibold text-gray-900">{kls.dosenNama}</div>
                  {currentDosen && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Beban: <span className={dosenLoad > dosenMax ? "text-red-600 font-bold" : "text-slate-600"}>{dosenLoad}</span>/{dosenMax} SKS
                    </div>
                  )}
                </td>

                {/* 4. Daftar Mahasiswa */}
                <td className="py-3 px-4 border-r border-gray-100">
                  <ul className="space-y-1.5 mb-3">
                    {(kls.mahasiswa_ids || []).map((mhsId) => {
                      const mhs = mahasiswa.find((m) => String(m.id) === String(mhsId));
                      const mhsLoad = calculateStudentLoad(mhsId);
                      const mhsMax = mhs?.max_sks || 20;

                      return (
                        <li key={mhsId} className="flex justify-between items-center bg-gray-100 rounded px-2.5 py-1 text-xs">
                          <span className="text-gray-800 font-medium">
                            {mhs ? `${mhs.nama} (${mhs.nim})` : `ID: ${mhsId}`} &bull; <span className="text-blue-700 font-bold">{mhsLoad}/{mhsMax} SKS</span>
                          </span>
                          {canUpdate && (
                            <button
                              onClick={() => handleDeleteMahasiswa(kls, mhsId)}
                              className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer transition text-sm leading-none"
                              title="Keluarkan dari kelas"
                            >
                              &times;
                            </button>
                          )}
                        </li>
                      );
                    })}
                    {(!kls.mahasiswa_ids || kls.mahasiswa_ids.length === 0) && (
                      <li className="text-gray-400 italic text-xs">Belum ada mahasiswa</li>
                    )}
                  </ul>

                  {canUpdate && (
                    <div className="flex gap-2 items-center pt-2 border-t border-gray-100">
                      <select
                        className="border px-2 py-1 text-xs rounded bg-white w-full focus:outline-none focus:ring focus:ring-blue-300"
                        value={selectedMhs[kls.id] || ""}
                        onChange={(e) => setSelectedMhs({ ...selectedMhs, [kls.id]: e.target.value })}
                      >
                        <option value="">Pilih Mahasiswa...</option>
                        {mahasiswa
                          .filter((m) => !(kls.mahasiswa_ids || []).map(String).includes(String(m.id)))
                          .map((m) => {
                            const mhsLoad = calculateStudentLoad(m.id);
                            return (
                              <option key={m.id} value={m.id}>
                                {m.nama} ({mhsLoad}/{m.max_sks} SKS)
                              </option>
                            );
                          })}
                      </select>
                      <button
                        onClick={() => handleAddMahasiswa(kls, selectedMhs[kls.id])}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs font-semibold rounded cursor-pointer transition flex-shrink-0"
                      >
                        Tambah
                      </button>
                    </div>
                  )}
                </td>

                {/* 5. Aksi */}
                <td className="py-3 px-4 text-center space-x-2">
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
            );
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500 italic">
                Tidak ada data kelas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KelasTable;
