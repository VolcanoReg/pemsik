import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";
import Button from "@/Pages/Admin/Components/Button";

const MataKuliahModal = ({
  isOpen,
  isEdit,
  form,
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
            {isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
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
            <Label htmlFor="kode">Kode MK</Label>
            <Input
              type="text"
              name="kode"
              value={form.kode}
              onChange={onChange}
              readOnly={isEdit}
              placeholder="Masukkan Kode MK (misal: A11.05401)"
              required
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama Mata Kuliah</Label>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={onChange}
              placeholder="Masukkan Nama Mata Kuliah"
              required
            />
          </div>
          <div>
            <Label htmlFor="sks">SKS</Label>
            <Input
              type="number"
              name="sks"
              min="1"
              max="6"
              value={form.sks}
              onChange={onChange}
              placeholder="Masukkan Jumlah SKS (1-6)"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
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

export default MataKuliahModal;
