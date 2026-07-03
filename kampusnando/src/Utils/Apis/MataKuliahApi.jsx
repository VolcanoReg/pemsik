import { supabase, handleRequest } from "@/Utils/supabaseClient";

// Ambil semua mata kuliah
export const getAllMataKuliah = (params = {}) => handleRequest("matakuliah", params, ["nama", "kode"]);

// Ambil 1 mata kuliah
export const getMataKuliah = async (id) => {
  const { data, error } = await supabase.from("matakuliah").select("*").eq("id", id).single();
  if (error) throw error;
  return { data };
};

// Tambah mata kuliah
export const storeMataKuliah = async (payload) => {
  const { data, error } = await supabase.from("matakuliah").insert(payload).select().single();
  if (error) throw error;
  return { data };
};

// Update mata kuliah
export const updateMataKuliah = async (id, payload) => {
  const { data, error } = await supabase.from("matakuliah").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return { data };
};

// Hapus mata kuliah
export const deleteMataKuliah = async (id) => {
  const { data, error } = await supabase.from("matakuliah").delete().eq("id", id).select().single();
  if (error) throw error;
  return { data };
};
