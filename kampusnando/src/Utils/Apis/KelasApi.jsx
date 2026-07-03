import { supabase, handleRequest } from "@/Utils/supabaseClient";

// Ambil semua kelas
export const getAllKelas = (params = {}) => handleRequest("kelas", params, ["nama"]);

// Ambil 1 kelas
export const getKelas = async (id) => {
  const { data, error } = await supabase.from("kelas").select("*").eq("id", id).single();
  if (error) throw error;
  return { data };
};

// Tambah kelas
export const storeKelas = async (payload) => {
  // Pastikan field terisi dengan benar untuk backward compatibility
  const formattedPayload = {
    ...payload,
    matakuliahId: payload.matakuliahId || parseInt(payload.mata_kuliah_id),
    dosenId: payload.dosenId || parseInt(payload.dosen_id),
    mata_kuliah_id: String(payload.mata_kuliah_id || payload.matakuliahId),
    dosen_id: String(payload.dosen_id || payload.dosenId),
    mahasiswa_ids: payload.mahasiswa_ids || []
  };
  const { data, error } = await supabase.from("kelas").insert(formattedPayload).select().single();
  if (error) throw error;
  return { data };
};

// Update kelas
export const updateKelas = async (id, payload) => {
  const formattedPayload = {
    ...payload
  };
  if (payload.matakuliahId || payload.mata_kuliah_id) {
    formattedPayload.matakuliahId = payload.matakuliahId || parseInt(payload.mata_kuliah_id);
    formattedPayload.mata_kuliah_id = String(payload.mata_kuliah_id || payload.matakuliahId);
  }
  if (payload.dosenId || payload.dosen_id) {
    formattedPayload.dosenId = payload.dosenId || parseInt(payload.dosen_id);
    formattedPayload.dosen_id = String(payload.dosen_id || payload.dosenId);
  }
  const { data, error } = await supabase.from("kelas").update(formattedPayload).eq("id", id).select().single();
  if (error) throw error;
  return { data };
};

// Hapus kelas
export const deleteKelas = async (id) => {
  const { data, error } = await supabase.from("kelas").delete().eq("id", id).select().single();
  if (error) throw error;
  return { data };
};
