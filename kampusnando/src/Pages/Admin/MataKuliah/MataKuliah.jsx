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

  // Pagination, Filter, and Sort states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const canCreate = user?.permission?.includes("matakuliah.create");

  const queryParams = {
    _page: page,
    _limit: limit,
    _sort: sortField,
    _order: sortOrder,
    ...(search ? { q: search } : {}),
  };

  const { data: mataKuliahResponse, isLoading, isError } = useMataKuliah(queryParams);
  const mataKuliahList = mataKuliahResponse?.data || [];
  const totalData = mataKuliahResponse?.total || 0;
  const totalPages = Math.ceil(totalData / limit);

  const { mutate: addMataKuliah } = useStoreMataKuliah();
  const { mutate: editMataKuliah } = useUpdateMataKuliah();
  const { mutate: removeMataKuliah } = useDeleteMataKuliah();

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

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

        {/* Control Bar: Filter, Search, Limit, Sort */}
        <div className="flex flex-wrap gap-4 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100 items-center">
          <input
            type="text"
            placeholder="Cari (Nama/Kode MK)..."
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
            <option value="kode">Urutkan Kode MK</option>
            <option value="sks">Urutkan SKS</option>
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
            <MataKuliahTable
              data={mataKuliahList}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
