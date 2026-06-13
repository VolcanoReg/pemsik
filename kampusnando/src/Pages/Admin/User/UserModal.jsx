import Button from "@/Pages/Admin/Components/Button";
import Label from "@/Pages/Admin/Components/Label";

export const AVAILABLE_PERMISSIONS = [
  "mahasiswa.create",
  "mahasiswa.read",
  "mahasiswa.update",
  "mahasiswa.delete",
  "dosen.create",
  "dosen.read",
  "dosen.update",
  "dosen.delete",
  "users.manage",
];

const UserModal = ({
  isOpen,
  selectedUser,
  role,
  setRole,
  permissions,
  onPermissionChange,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            Edit Role & Hak Akses: {selectedUser?.name}
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
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Mahasiswa">Mahasiswa</option>
            </select>
          </div>

          <div>
            <Label>Hak Akses (Permissions)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto border p-3 rounded-lg bg-gray-50">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <label key={perm} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={() => onPermissionChange(perm)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
