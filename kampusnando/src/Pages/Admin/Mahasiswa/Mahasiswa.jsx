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

  // Pagination, Filter, and Sort states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const canCreate = user?.permission?.includes("mahasiswa.create");

  const queryParams = {
    _page: page,
    _limit: limit,
    _sort: sortField,
    _order: sortOrder,
    ...(search ? { q: search } : {}),
  };
  
  const { data: mahasiswaResponse, isLoading, isError } = useMahasiswa(queryParams);
  const mahasiswaList = mahasiswaResponse?.data || [];
  const totalData = mahasiswaResponse?.total || 0;
  const totalPages = Math.ceil(totalData / limit);

  const { mutate: addMahasiswa } = useStoreMahasiswa();
  const { mutate: editMahasiswa } = useUpdateMahasiswa();
  const { mutate: removeMahasiswa } = useDeleteMahasiswa();

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

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

        {/* Control Bar: Filter, Search, Limit, Sort */}
        <div className="flex flex-wrap gap-4 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100 items-center">
          <input
            type="text"
            placeholder="Cari (Nama/NIM)..."
            className="border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300 w-full md:w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300 bg-white"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5 per halaman</option>
            <option value="10">10 per halaman</option>
            <option value="20">20 per halaman</option>
          </select>

          <select
            className="border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300 bg-white"
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setPage(1);
            }}
          >
            <option value="id">Urutkan ID</option>
            <option value="nama">Urutkan Nama</option>
            <option value="nim">Urutkan NIM</option>
          </select>

          <select
            className="border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300 bg-white"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
          >
            <option value="asc">Menaik (A-Z)</option>
            <option value="desc">Menurun (Z-A)</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : isError ? (
          <div className="text-center py-4 text-red-500">Terjadi kesalahan saat memuat data.</div>
        ) : (
          <>
            <MahasiswaTable
              data={mahasiswaList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
            />

            {/* Pagination Footer */}
            <div className="flex justify-between items-center mt-4 bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
              <span className="text-sm text-gray-600">
                Menampilkan total <span className="font-semibold text-blue-600">{totalData}</span> data (Halaman <span className="font-semibold">{page}</span> dari <span className="font-semibold">{totalPages || 1}</span>)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Mundur
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages || totalPages === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Maju
                </button>
              </div>
            </div>
          </>
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
