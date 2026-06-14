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

  // Pagination, Filter, and Sort states for Kelas
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const canCreate = user?.permission?.includes("kelas.create");

  const queryParams = {
    _page: page,
    _limit: limit,
    _sort: sortField,
    _order: sortOrder,
    ...(search ? { q: search } : {}),
  };

  const { data: kelasResponse, isLoading: isKelasLoading, isError: isKelasError } = useKelas(queryParams);
  const kelasList = kelasResponse?.data || [];
  const totalData = kelasResponse?.total || 0;
  const totalPages = Math.ceil(totalData / limit);

  // Load ALL Dosen and ALL Mata Kuliah for dropdown list selection and mapping
  const { data: dosenResponse, isLoading: isDosenLoading } = useDosen({});
  const dosenList = dosenResponse?.data || [];

  const { data: mataKuliahResponse, isLoading: isMKLoading } = useMataKuliah({});
  const mataKuliahList = mataKuliahResponse?.data || [];

  const { mutate: addKelas } = useStoreKelas();
  const { mutate: editKelas } = useUpdateKelas();
  const { mutate: removeKelas } = useDeleteKelas();

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

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

        {/* Control Bar: Filter, Search, Limit, Sort */}
        <div className="flex flex-wrap gap-4 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100 items-center">
          <input
            type="text"
            placeholder="Cari (Nama Kelas)..."
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
            <option value="nama">Urutkan Nama Kelas</option>
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
        ) : isKelasError ? (
          <div className="text-center py-4 text-red-500">Terjadi kesalahan saat memuat data.</div>
        ) : (
          <>
            <KelasTable
              data={mappedKelas}
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
