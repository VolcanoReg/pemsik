import React, { useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "@/Utils/Hooks/useKelas";
import { useDosen } from "@/Utils/Hooks/useDosen";
import { useMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Layout & UI Components
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

const RencanaStudi = () => {
  const { user } = useAuthStateContext();

  // Queries
  const { data: kelasRes, isLoading: isKelasLoading } = useKelas({});
  const { data: dosenRes, isLoading: isDosenLoading } = useDosen({});
  const { data: mahasiswaRes, isLoading: isMhsLoading } = useMahasiswa({});
  const { data: matkulRes, isLoading: isMatkulLoading } = useMataKuliah({});

  // Mutations
  const { mutate: addKelas } = useStoreKelas();
  const { mutate: editKelas } = useUpdateKelas();
  const { mutate: removeKelas } = useDeleteKelas();

  // UI state
  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });

  const kelas = kelasRes?.data || [];
  const dosen = dosenRes?.data || [];
  const mahasiswa = mahasiswaRes?.data || [];
  const mataKuliah = matkulRes?.data || [];

  const isLoading = isKelasLoading || isDosenLoading || isMhsLoading || isMatkulLoading;

  // Business logic validations
  const handleAddMahasiswa = (kelasItem, mhsId) => {
    if (!mhsId) {
      toastError("Pilih mahasiswa terlebih dahulu");
      return;
    }

    const matkul = mataKuliah.find((m) => String(m.id) === String(kelasItem.mata_kuliah_id || kelasItem.matakuliahId));
    const sksBaru = matkul?.sks || 0;

    // Hitung SKS yang sudah diambil di kelas lain
    const totalSksSekarang = kelas
      .filter((k) => (k.mahasiswa_ids || []).map(String).includes(String(mhsId)))
      .map((k) => {
        const m = mataKuliah.find((mk) => String(mk.id) === String(k.mata_kuliah_id || k.matakuliahId));
        return m?.sks || 0;
      })
      .reduce((acc, curr) => acc + curr, 0);

    const studentObj = mahasiswa.find((m) => String(m.id) === String(mhsId));
    const batasMaxSks = studentObj?.max_sks || 0;

    if (totalSksSekarang + sksBaru > batasMaxSks) {
      toastError(
        `Batas SKS terlampaui! Maksimal SKS mahasiswa ini adalah ${batasMaxSks} SKS. SKS terpakai: ${totalSksSekarang}, Ingin ditambah: ${sksBaru}`
      );
      return;
    }

    if ((kelasItem.mahasiswa_ids || []).map(String).includes(String(mhsId))) {
      toastError("Mahasiswa sudah terdaftar di kelas ini.");
      return;
    }

    const updated = {
      ...kelasItem,
      mahasiswa_ids: [...(kelasItem.mahasiswa_ids || []).map(String), String(mhsId)],
    };

    editKelas(
      { id: kelasItem.id, data: updated },
      {
        onSuccess: () => {
          toastSuccess("Mahasiswa berhasil ditambahkan ke kelas.");
          setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
        },
        onError: (err) => {
          toastError("Gagal memperbarui data kelas: " + err.message);
        },
      }
    );
  };

  const handleChangeDosen = (kelasItem) => {
    const dsnId = selectedDsn[kelasItem.id];
    if (!dsnId) {
      toastError("Pilih dosen terlebih dahulu");
      return;
    }

    const matkul = mataKuliah.find((m) => String(m.id) === String(kelasItem.mata_kuliah_id || kelasItem.matakuliahId));
    const sksKelasIni = matkul?.sks || 0;

    // Hitung SKS yang diampu dosen di kelas lain
    const totalSksDiampu = kelas
      .filter((k) => String(k.dosen_id || k.dosenId) === String(dsnId) && String(k.id) !== String(kelasItem.id))
      .map((k) => {
        const m = mataKuliah.find((mk) => String(mk.id) === String(k.mata_kuliah_id || k.matakuliahId));
        return m?.sks || 0;
      })
      .reduce((acc, curr) => acc + curr, 0);

    const dosenObj = dosen.find((d) => String(d.id) === String(dsnId));
    const batasMaxDosen = dosenObj?.max_sks || 0;

    if (totalSksDiampu + sksKelasIni > batasMaxDosen) {
      toastError(
        `Beban SKS dosen terlampaui! Maksimal SKS dosen ini adalah ${batasMaxDosen} SKS. SKS diampu saat ini: ${totalSksDiampu}, SKS kelas ini: ${sksKelasIni}`
      );
      return;
    }

    const updated = {
      ...kelasItem,
      dosen_id: String(dsnId),
      dosenId: Number(dsnId),
    };

    editKelas(
      { id: kelasItem.id, data: updated },
      {
        onSuccess: () => {
          toastSuccess("Dosen pengampu berhasil diperbarui.");
          setSelectedDsn((prev) => ({ ...prev, [kelasItem.id]: "" }));
        },
        onError: (err) => {
          toastError("Gagal memperbarui dosen pengampu: " + err.message);
        },
      }
    );
  };

  const handleDeleteMahasiswa = (kelasItem, mhsId) => {
    const updated = {
      ...kelasItem,
      mahasiswa_ids: (kelasItem.mahasiswa_ids || []).map(String).filter((id) => id !== String(mhsId)),
    };

    editKelas(
      { id: kelasItem.id, data: updated },
      {
        onSuccess: () => {
          toastSuccess("Mahasiswa berhasil dikeluarkan dari kelas.");
        },
        onError: (err) => {
          toastError("Gagal mengeluarkan mahasiswa: " + err.message);
        },
      }
    );
  };

  const handleDeleteKelas = (kelasId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;

    removeKelas(kelasId, {
      onSuccess: () => {
        toastSuccess("Kelas berhasil dihapus.");
      },
      onError: (err) => {
        toastError("Gagal menghapus kelas: " + err.message);
      },
    });
  };

  const handleSubmitNewKelas = (e) => {
    e.preventDefault();
    if (!form.mata_kuliah_id || !form.dosen_id) {
      toastError("Mata Kuliah dan Dosen wajib dipilih!");
      return;
    }

    const selectedMK = mataKuliah.find((m) => String(m.id) === String(form.mata_kuliah_id));
    const classNameStr = selectedMK ? `${selectedMK.nama} - Kelas ${kelas.length + 1}` : `Kelas Baru ${kelas.length + 1}`;

    const payload = {
      nama: classNameStr,
      mata_kuliah_id: String(form.mata_kuliah_id),
      matakuliahId: Number(form.mata_kuliah_id),
      dosen_id: String(form.dosen_id),
      dosenId: Number(form.dosen_id),
      mahasiswa_ids: [],
    };

    addKelas(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        setForm({ mata_kuliah_id: "", dosen_id: "" });
        toastSuccess("Kelas baru berhasil dibuat.");
      },
      onError: (err) => {
        toastError("Gagal membuat kelas baru: " + err.message);
      },
    });
  };

  // Filter Mata Kuliah yang belum ada kelasnya
  const matkulSudahAdaKelas = kelas.map((k) => String(k.mata_kuliah_id || k.matakuliahId));
  const matkulBelumAdaKelas = mataKuliah.filter((m) => !matkulSudahAdaKelas.includes(String(m.id)));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-600 font-medium text-lg animate-pulse">Memuat Data Akademik...</div>
      </div>
    );
  }

  const canCreate = user?.permission?.includes("rencana-studi.create");

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Heading as="h2" className="mb-0 text-left">Manajemen Rencana Studi</Heading>
          {canCreate && (
            <Button onClick={() => setIsModalOpen(true)}>
              + Buat Kelas Baru
            </Button>
          )}
        </div>

        <TableRencanaStudi
          kelas={kelas}
          mahasiswa={mahasiswa}
          dosen={dosen}
          mataKuliah={mataKuliah}
          selectedMhs={selectedMhs}
          setSelectedMhs={setSelectedMhs}
          selectedDsn={selectedDsn}
          setSelectedDsn={setSelectedDsn}
          handleAddMahasiswa={handleAddMahasiswa}
          handleDeleteMahasiswa={handleDeleteMahasiswa}
          handleChangeDosen={handleChangeDosen}
          handleDeleteKelas={handleDeleteKelas}
          user={user}
        />
      </Card>

      {isModalOpen && (
        <ModalRencanaStudi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          onSubmit={handleSubmitNewKelas}
          form={form}
          dosen={dosen}
          mataKuliah={matkulBelumAdaKelas}
        />
      )}
    </>
  );
};

export default RencanaStudi;
