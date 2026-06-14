import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";
import Button from "@/Pages/Admin/Components/Button";

const KelasModal = ({
  isOpen,
  isEdit,
  form,
  dosenList = [],
  mataKuliahList = [],
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Kelas" : "Tambah Kelas"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="nama">Nama Kelas</Label>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={onChange}
              placeholder="Masukkan Nama Kelas (misal: A11.4401)"
              required
            />
          </div>

          <div>
            <Label htmlFor="matakuliahId">Mata Kuliah</Label>
            <select
              name="matakuliahId"
              value={form.matakuliahId}
              onChange={onChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {mataKuliahList.map((mk) => (
                <option key={mk.id} value={mk.id}>
                  {mk.kode} - {mk.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="dosenId">Dosen Pengampu</Label>
            <select
              name="dosenId"
              value={form.dosenId}
              onChange={onChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="">-- Pilih Dosen --</option>
              {dosenList.map((dsn) => (
                <option key={dsn.id} value={dsn.id}>
                  {dsn.nama} ({dsn.nidn})
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

export default KelasModal;
