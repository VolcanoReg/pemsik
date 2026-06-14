import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MahasiswaTable from "@/Pages/Admin/Mahasiswa/MahasiswaTable";
import MahasiswaModal from "@/Pages/Admin/Mahasiswa/MahasiswaModal";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  confirmDelete,
  confirmUpdate,
} from "@/Utils/Helpers/SwalHelpers";

import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();
  const [form, setForm] = useState({ id: "", nim: "", nama: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const canCreate = user?.permission?.includes("mahasiswa.create");
  
  const { data: mahasiswaList = [], isLoading, isError } = useMahasiswa();
  const { mutate: addMahasiswa } = useStoreMahasiswa();
  const { mutate: editMahasiswa } = useUpdateMahasiswa();
  const { mutate: removeMahasiswa } = useDeleteMahasiswa();

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ id: "", nim: "", nama: "" });
    setIsEdit(false);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !form.nama) {
      toastError("NIM dan Nama wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        editMahasiswa(
          { id: form.id, data: form },
          {
            onSuccess: () => {
              toastSuccess("Data berhasil diperbarui");
              setForm({ id: "", nim: "", nama: "" });
              setIsEdit(false);
              setIsModalOpen(false);
            },
            onError: (err) => {
              toastError("Gagal merubah data: " + err.message);
            }
          }
        );
      });
    } else {
      const exists = mahasiswaList.find((m) => m.nim === form.nim);
      if (exists) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      addMahasiswa(form, {
        onSuccess: () => {
          toastSuccess("Data berhasil ditambahkan");
          setForm({ id: "", nim: "", nama: "" });
          setIsModalOpen(false);
        },
        onError: (err) => {
          toastError("Gagal menambah data: " + err.message);
        }
      });
    }
  }

  const handleEdit = (mhs) => {
    setForm({ id: mhs.id, nim: mhs.nim, nama: mhs.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  }

  const handleDelete = (id) => {
    confirmDelete(() => {
      removeMahasiswa(id, {
        onSuccess: () => {
          toastSuccess("Data berhasil dihapus");
        },
        onError: (err) => {
          toastError("Gagal menghapus data: " + err.message);
        }
      });
    });
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">Daftar Mahasiswa</Heading>
          {canCreate && <Button onClick={() => openAddModal()}>+ Tambah Mahasiswa</Button>}
        </div>

        {isLoading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : isError ? (
          <div className="text-center py-4 text-red-500">Terjadi kesalahan saat memuat data.</div>
        ) : (
          <MahasiswaTable
            data={mahasiswaList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
          />
        )}
      </Card>

      {isModalOpen && (
        <MahasiswaModal
          isOpen={isModalOpen}
          isEdit={isEdit}
          form={form}
          onChange={handleChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default Mahasiswa;
