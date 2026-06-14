import { useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MataKuliahTable from "@/Pages/Admin/MataKuliah/MataKuliahTable";
import MataKuliahModal from "@/Pages/Admin/MataKuliah/MataKuliahModal";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useMataKuliah,
  useStoreMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from "@/Utils/Hooks/useMataKuliah";

const MataKuliah = () => {
  const { user } = useAuthStateContext();
  const [form, setForm] = useState({ id: "", kode: "", nama: "", sks: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const canCreate = user?.permission?.includes("matakuliah.create");

  const { data: mataKuliahList = [], isLoading, isError } = useMataKuliah();
  const { mutate: addMataKuliah } = useStoreMataKuliah();
  const { mutate: editMataKuliah } = useUpdateMataKuliah();
  const { mutate: removeMataKuliah } = useDeleteMataKuliah();

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ id: "", kode: "", nama: "", sks: "" });
    setIsEdit(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kode || !form.nama || !form.sks) {
      toastError("Semua field wajib diisi");
      return;
    }

    const payload = {
      ...form,
      sks: parseInt(form.sks, 10),
    };

    if (isEdit) {
      confirmUpdate(() => {
        editMataKuliah(
          { id: form.id, data: payload },
          {
            onSuccess: () => {
              toastSuccess("Mata kuliah berhasil diperbarui");
              setForm({ id: "", kode: "", nama: "", sks: "" });
              setIsEdit(false);
              setIsModalOpen(false);
            },
            onError: (err) => {
              toastError("Gagal memperbarui data: " + err.message);
            }
          }
        );
      });
    } else {
      const exists = mataKuliahList.find((mk) => mk.kode === form.kode);
      if (exists) {
        toastError("Kode MK sudah terdaftar!");
        return;
      }
      addMataKuliah(payload, {
        onSuccess: () => {
          toastSuccess("Mata kuliah berhasil ditambahkan");
          setForm({ id: "", kode: "", nama: "", sks: "" });
          setIsModalOpen(false);
        },
        onError: (err) => {
          toastError("Gagal menambahkan data: " + err.message);
        }
      });
    }
  };

  const handleEdit = (mk) => {
    setForm({ id: mk.id, kode: mk.kode, nama: mk.nama, sks: mk.sks });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      removeMataKuliah(id, {
        onSuccess: () => {
          toastSuccess("Mata kuliah berhasil dihapus");
        },
        onError: (err) => {
          toastError("Gagal menghapus data: " + err.message);
        }
      });
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">Daftar Mata Kuliah</Heading>
          {canCreate && <Button onClick={() => openAddModal()}>+ Tambah MK</Button>}
        </div>

        {isLoading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : isError ? (
          <div className="text-center py-4 text-red-500">Terjadi kesalahan saat memuat data.</div>
        ) : (
          <MataKuliahTable
            data={mataKuliahList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {isModalOpen && (
        <MataKuliahModal
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

export default MataKuliah;
