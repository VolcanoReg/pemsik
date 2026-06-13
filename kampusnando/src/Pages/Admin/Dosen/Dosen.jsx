import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import DosenTable from "@/Pages/Admin/Dosen/DosenTable";
import DosenModal from "@/Pages/Admin/Dosen/DosenModal";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";

import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Dosen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();
  const [form, setForm] = useState({ nidn: "", nama: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dosen, setDosen] = useState([]);

  const canCreate = user?.permission?.includes("dosen.create");

  const fetchDosen = async () => {
    try {
      const res = await getAllDosen();
      setDosen(res.data);
    } catch (err) {
      toastError("Gagal mengambil data dosen");
    }
  };

  useEffect(() => {
    setTimeout(() => fetchDosen(), 500);
  }, []);

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ nidn: "", nama: "" });
    setIsEdit(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nidn || !form.nama) {
      toastError("NIDN dan Nama wajib diisi");
      return;
    }

    try {
      if (isEdit) {
        confirmUpdate(async () => {
          await updateDosen(form.id || form.nidn, form);
          toastSuccess("Data berhasil diperbarui");
          setForm({ nidn: "", nama: "" });
          setIsEdit(false);
          setIsModalOpen(false);
          fetchDosen();
        });
      } else {
        const exists = dosen.find((d) => d.nidn === form.nidn);
        if (exists) {
          toastError("NIDN sudah terdaftar!");
          return;
        }
        await storeDosen(form);
        toastSuccess("Data berhasil ditambahkan");
        setForm({ nidn: "", nama: "" });
        setIsModalOpen(false);
        fetchDosen();
      }
    } catch (err) {
      toastError("Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleEdit = (dsn) => {
    setForm({ id: dsn.id, nidn: dsn.nidn, nama: dsn.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteDosen(id);
        toastSuccess("Data berhasil dihapus");
        fetchDosen();
      } catch (err) {
        toastError("Gagal menghapus data");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">Daftar Dosen</Heading>
          {canCreate && <Button onClick={() => openAddModal()}>+ Tambah Dosen</Button>}
        </div>

        <DosenTable
          data={dosen}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDetail={(id) => navigate(`/admin/dosen/${id}`)}
        />
      </Card>
      
      {isModalOpen && (
        <DosenModal
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

export default Dosen;
