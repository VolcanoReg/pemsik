import { useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import KelasTable from "@/Pages/Admin/Kelas/KelasTable";
import KelasModal from "@/Pages/Admin/Kelas/KelasModal";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { useDosen } from "@/Utils/Hooks/useDosen";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import {
  useKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "@/Utils/Hooks/useKelas";

const Kelas = () => {
  const { user } = useAuthStateContext();
  const [form, setForm] = useState({ id: "", nama: "", matakuliahId: "", dosenId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const canCreate = user?.permission?.includes("kelas.create");

  const { data: kelasList = [], isLoading: isKelasLoading, isError: isKelasError } = useKelas();
  const { data: dosenList = [], isLoading: isDosenLoading } = useDosen();
  const { data: mataKuliahList = [], isLoading: isMKLoading } = useMataKuliah();

  const { mutate: addKelas } = useStoreKelas();
  const { mutate: editKelas } = useUpdateKelas();
  const { mutate: removeKelas } = useDeleteKelas();

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ id: "", nama: "", matakuliahId: "", dosenId: "" });
    setIsEdit(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.matakuliahId || !form.dosenId) {
      toastError("Semua field wajib diisi");
      return;
    }

    const payload = {
      ...form,
      matakuliahId: parseInt(form.matakuliahId, 10),
      dosenId: parseInt(form.dosenId, 10),
    };

    if (isEdit) {
      confirmUpdate(() => {
        editKelas(
          { id: form.id, data: payload },
          {
            onSuccess: () => {
              toastSuccess("Kelas berhasil diperbarui");
              setForm({ id: "", nama: "", matakuliahId: "", dosenId: "" });
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
      const exists = kelasList.find((k) => k.nama.toLowerCase() === form.nama.toLowerCase());
      if (exists) {
        toastError("Nama kelas sudah digunakan!");
        return;
      }
      addKelas(payload, {
        onSuccess: () => {
          toastSuccess("Kelas berhasil ditambahkan");
          setForm({ id: "", nama: "", matakuliahId: "", dosenId: "" });
          setIsModalOpen(false);
        },
        onError: (err) => {
          toastError("Gagal menambahkan data: " + err.message);
        }
      });
    }
  };

  const handleEdit = (kls) => {
    setForm({
      id: kls.id,
      nama: kls.nama,
      matakuliahId: kls.matakuliahId,
      dosenId: kls.dosenId,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      removeKelas(id, {
        onSuccess: () => {
          toastSuccess("Kelas berhasil dihapus");
        },
        onError: (err) => {
          toastError("Gagal menghapus data: " + err.message);
        }
      });
    });
  };

  // Resolve relasi mata kuliah dan dosen
  const mappedKelas = kelasList.map((k) => {
    const mk = mataKuliahList.find((m) => Number(m.id) === Number(k.matakuliahId));
    const dsn = dosenList.find((d) => Number(d.id) === Number(k.dosenId));
    return {
      ...k,
      mataKuliahNama: mk ? `${mk.kode} - ${mk.nama}` : "N/A",
      dosenNama: dsn ? dsn.nama : "N/A",
    };
  });

  const isLoading = isKelasLoading || isDosenLoading || isMKLoading;

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">Daftar Kelas</Heading>
          {canCreate && <Button onClick={() => openAddModal()}>+ Tambah Kelas</Button>}
        </div>

        {isLoading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : isKelasError ? (
          <div className="text-center py-4 text-red-500">Terjadi kesalahan saat memuat data.</div>
        ) : (
          <KelasTable
            data={mappedKelas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {isModalOpen && (
        <KelasModal
          isOpen={isModalOpen}
          isEdit={isEdit}
          form={form}
          dosenList={dosenList}
          mataKuliahList={mataKuliahList}
          onChange={handleChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default Kelas;
