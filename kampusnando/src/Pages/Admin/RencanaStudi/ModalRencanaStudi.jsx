import Label from "@/Pages/Admin/Components/Label";
import Button from "@/Pages/Admin/Components/Button";

const ModalRencanaStudi = ({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  form,
  dosen = [],
  mataKuliah = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-blue-600">
            Buat Kelas Baru
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
            <select
              name="mata_kuliah_id"
              value={form.mata_kuliah_id}
              onChange={onChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-white"
              required
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {mataKuliah.map((mk) => (
                <option key={mk.id} value={mk.id}>
                  {mk.nama} ({mk.sks} SKS)
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="dosen_id">Dosen Pengampu</Label>
            <select
              name="dosen_id"
              value={form.dosen_id}
              onChange={onChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-white"
              required
            >
              <option value="">-- Pilih Dosen --</option>
              {dosen.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama} (Max: {d.max_sks} SKS)
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRencanaStudi;
