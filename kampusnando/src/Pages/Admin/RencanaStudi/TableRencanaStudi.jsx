import React from "react";

const TableRencanaStudi = ({
  kelas = [],
  mahasiswa = [],
  dosen = [],
  mataKuliah = [],
  selectedMhs = {},
  setSelectedMhs,
  selectedDsn = {},
  setSelectedDsn,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  handleChangeDosen,
  handleDeleteKelas,
  user,
}) => {
  const canUpdate = user?.permission?.includes("rencana-studi.update");
  const canDelete = user?.permission?.includes("rencana-studi.delete");

  return (
    <div className="overflow-x-auto shadow rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full bg-white text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold border-b">Mata Kuliah (SKS)</th>
            <th className="py-3 px-4 text-left font-semibold border-b">Dosen Pengampu</th>
            <th className="py-3 px-4 text-left font-semibold border-b">Daftar Mahasiswa</th>
            <th className="py-3 px-4 text-center font-semibold border-b w-36">Aksi Kelas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {kelas.map((k, index) => {
            const matkul = mataKuliah.find((m) => String(m.id) === String(k.mata_kuliah_id || k.matakuliahId));
            const dosenPengampu = dosen.find((d) => String(d.id) === String(k.dosen_id || k.dosenId));

            return (
              <tr key={k.id} className={index % 2 === 0 ? "bg-white hover:bg-gray-50 transition" : "bg-gray-55 hover:bg-gray-100 transition"}>
                {/* Column 1: Mata Kuliah */}
                <td className="py-3 px-4 font-medium border-r border-gray-100">
                  {matkul ? (
                    <div>
                      <div className="font-semibold text-gray-900">{matkul.nama}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{matkul.kode || `ID: ${matkul.id}`} &bull; {matkul.sks} SKS</div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Tidak ditemukan</span>
                  )}
                </td>

                {/* Column 2: Dosen Pengampu */}
                <td className="py-3 px-4 border-r border-gray-100">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 block">Saat ini:</span>
                    <strong className="text-gray-900">{dosenPengampu?.nama || "-"}</strong>
                  </div>
                  {canUpdate && (
                    <div className="flex gap-2 items-center mt-1">
                      <select
                        className="border px-2 py-1 text-xs rounded bg-white w-full focus:outline-none focus:ring focus:ring-blue-300"
                        value={selectedDsn[k.id] || ""}
                        onChange={(e) => setSelectedDsn({ ...selectedDsn, [k.id]: e.target.value })}
                      >
                        <option value="">Pilih Dosen Baru...</option>
                        {dosen.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.nama} (Max SKS: {d.max_sks})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleChangeDosen(k)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs font-semibold rounded cursor-pointer transition flex-shrink-0"
                      >
                        Ganti
                      </button>
                    </div>
                  )}
                </td>

                {/* Column 3: Daftar Mahasiswa */}
                <td className="py-3 px-4 border-r border-gray-100">
                  <ul className="space-y-1.5 mb-3">
                    {(k.mahasiswa_ids || []).map((mhsId) => {
                      const mhs = mahasiswa.find((m) => String(m.id) === String(mhsId));
                      return (
                        <li key={mhsId} className="flex justify-between items-center bg-gray-100 rounded px-2.5 py-1 text-xs">
                          <span className="text-gray-800 font-medium">
                            {mhs ? `${mhs.nama} (${mhs.nim})` : `ID: ${mhsId}`}
                          </span>
                          {canUpdate && (
                            <button
                              onClick={() => handleDeleteMahasiswa(k, mhsId)}
                              className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer transition text-sm leading-none"
                              title="Keluarkan dari kelas"
                            >
                              &times;
                            </button>
                          )}
                        </li>
                      );
                    })}
                    {(!k.mahasiswa_ids || k.mahasiswa_ids.length === 0) && (
                      <li className="text-gray-400 italic text-xs">Belum ada mahasiswa</li>
                    )}
                  </ul>

                  {canUpdate && (
                    <div className="flex gap-2 items-center pt-2 border-t border-gray-100">
                      <select
                        className="border px-2 py-1 text-xs rounded bg-white w-full focus:outline-none focus:ring focus:ring-blue-300"
                        value={selectedMhs[k.id] || ""}
                        onChange={(e) => setSelectedMhs({ ...selectedMhs, [k.id]: e.target.value })}
                      >
                        <option value="">Pilih Mahasiswa...</option>
                        {mahasiswa
                          .filter((m) => !(k.mahasiswa_ids || []).map(String).includes(String(m.id)))
                          .map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.nama} (Max SKS: {m.max_sks})
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => handleAddMahasiswa(k, selectedMhs[k.id])}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs font-semibold rounded cursor-pointer transition flex-shrink-0"
                      >
                        Tambah
                      </button>
                    </div>
                  )}
                </td>

                {/* Column 4: Aksi Kelas */}
                <td className="py-3 px-4 text-center">
                  {canDelete ? (
                    <button
                      onClick={() => handleDeleteKelas(k.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
                    >
                      Hapus Kelas
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Tidak ada akses</span>
                  )}
                </td>
              </tr>
            );
          })}
          {kelas.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                Belum ada kelas yang dibuat.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableRencanaStudi;
