import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { getAllUsers, updateUserRolePermission } from "@/Utils/Apis/UserApi";

import UserTable from "./UserTable";
import UserModal from "./UserModal";

const UserManagement = () => {
  const { user: currentUser, setUser } = useAuthStateContext();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toastError("Gagal mengambil data user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setRole(user.role || "Mahasiswa");
    setPermissions(user.permission || []);
    setIsModalOpen(true);
  };

  const handlePermissionChange = (perm) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    confirmUpdate(async () => {
      try {
        const payload = {
          role,
          permission: permissions,
        };
        await updateUserRolePermission(selectedUser.id, payload);
        
        toastSuccess("User berhasil diperbarui");
        setIsModalOpen(false);

        // Jika user yang diupdate adalah diri sendiri, perbarui context state
        if (selectedUser.id === currentUser.id) {
          setUser({
            ...currentUser,
            role,
            permission: permissions,
          });
        }

        fetchUsers();
      } catch (err) {
        toastError("Gagal memperbarui user");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">Manajemen User</Heading>
        </div>

        <UserTable users={users} onEdit={openEditModal} />
      </Card>

      <UserModal
        isOpen={isModalOpen}
        selectedUser={selectedUser}
        role={role}
        setRole={setRole}
        permissions={permissions}
        onPermissionChange={handlePermissionChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default UserManagement;
