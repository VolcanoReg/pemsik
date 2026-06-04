import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";
import MahasiswaTable from "@/Pages/Admin/Mahasiswa/MahasiswaTable";
import MahasiswaModal from "@/Pages/Admin/Mahasiswa/MahasiswaModal";

import { mahasiswaList } from "@/Data/Dummy";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import {
  confirmDelete,
  confirmUpdate,
} from "@/Utils/Helpers/SwalHelpers";

import { toastSuccess } from "@/Utils/Helpers/ToastHelpers";



const Mahasiswa = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: "", nama: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const addMahasiswa = (newData) => {
      setMahasiswa([...mahasiswa, newData]);
  };

  const updateMahasiswa = (nim, newData) => {
    const updated = mahasiswa.map((mhs) => 
      mhs.nim === nim ? {...mhs, ...newData} : mhs
    );
    setMahasiswa(updated);
  };

  const deleteMahasiswa = (nim) => {
    const filtered = mahasiswa.filter((mhs) => mhs.nim !== nim);
    setMahasiswa(filtered);
  }

  import {
    getAllMahasiswa,
    storeMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
  } from "@/Utils/Apis/MahasiswaApi";

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ nim: "", nama: "" });
    setIsEdit(false);
  }

  const [mahasiswa, setMahasiswa] = useState([]);
	const fetchMahasiswa = async () => {
    getAllMahasiswa().then((res) => setMahasiswa(res.data));
  };

	useEffect(() => {
    setTimeout(() => fetchMahasiswa(), 500);
	}, []);

  const handleChange = (e) => {
    console.log("TRIGGERED")
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
          updateMahasiswa(form.nim, form);
          toastSuccess("Data berhasil diperbarui");
          setForm({ nim: "", nama: "" });
          setIsEdit(false);
          setIsModalOpen(false);
        });
      } else {
        const exists = mahasiswa.find((m) => m.nim === form.nim);
        if (exists) {
          toastError("NIM sudah terdaftar!");
          return;
        }
        //addMahasiswa(form);
        storeMahasiswa(form);
        toastSuccess("Data berhasil ditambahkan");
        setForm({ nim: "", nama: "" });
        setIsModalOpen(false);
      }
  }

  const handleEdit = (mhs) => {
    setForm({ id: mhs.id, nim: mhs.nim, nama: mhs.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  }

  const handleDelete = (nim) => {
    confirmDelete(() => {
      deleteMahasiswa(nim);
      toastSuccess("Data berhasil dihapus");
    });
  }

  

  return (
    
    <>
		<Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">Daftar Mahasiswa</Heading>
        <Button onClick={() => openAddModal()}>+ Tambah Mahasiswa</Button>
      </div>

      <MahasiswaTable
        data={mahasiswa}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
      />
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
