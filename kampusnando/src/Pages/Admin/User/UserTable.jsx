import Button from "@/Pages/Admin/Components/Button";

const UserTable = ({ users, onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-left">Hak Akses (Permissions)</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((usr, index) => (
            <tr key={usr.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              <td className="py-2 px-4 font-medium">{usr.name}</td>
              <td className="py-2 px-4">{usr.email}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  usr.role === "Admin" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}>
                  {usr.role || "N/A"}
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex flex-wrap gap-1 max-w-xs lg:max-w-md">
                  {usr.permission && usr.permission.map((perm) => (
                    <span key={perm} className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">
                      {perm}
                    </span>
                  ))}
                  {(!usr.permission || usr.permission.length === 0) && (
                    <span className="text-gray-400 text-xs">Tidak ada hak akses</span>
                  )}
                </div>
              </td>
              <td className="py-2 px-4 text-center">
                <Button size="sm" variant="warning" onClick={() => onEdit(usr)}>
                  Edit Role & Akses
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
