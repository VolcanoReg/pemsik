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



const Mahasiswa = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: "", nama: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ nim: "", nama: "" });
    setIsEdit(false);
  }

  const [mahasiswa, setMahasiswa] = useState([]);
	const fetchMahasiswa = async () => {
	  // bisa disimulasikan delay atau nanti diganti fetch API
    setMahasiswa(mahasiswaList);
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
      alert("NIM dan Nama wajib diisi");
      return;
    }

    if (isEdit) {
      updateMahasiswa(form.nim, form);
    } else {
      const exists = mahasiswa.find((m) => m.nim === form.nim);
      if (exists) {
        alert("NIM sudah terdaftar!");
        return;
      }
      addMahasiswa(form);
    }

    setForm({ nim: "", nama: "" });
    setIsEdit(false);
    setIsModalOpen(false);
  }

  const handleEdit = (mhs) => {
    setForm({ nim: mhs.nim, nama: mhs.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  }

  const handleDelete = (nim) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      deleteMahasiswa(nim);
    }
  }

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
        onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
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
