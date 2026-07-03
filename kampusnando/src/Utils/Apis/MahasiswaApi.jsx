import { supabase, handleRequest } from "@/Utils/supabaseClient";

// Ambil semua mahasiswa
export const getAllMahasiswa = (params = {}) => handleRequest("mahasiswa", params, ["nama", "nim"]);

// Ambil 1 mahasiswa
export const getMahasiswa = async (id) => {
  const { data, error } = await supabase.from("mahasiswa").select("*").eq("id", id).single();
  if (error) throw error;
  return { data };
};

// Tambah mahasiswa
export const storeMahasiswa = async (payload) => {
  const { data, error } = await supabase.from("mahasiswa").insert(payload).select().single();
  if (error) throw error;
  return { data };
};

// Update mahasiswa
export const updateMahasiswa = async (id, payload) => {
  const { data, error } = await supabase.from("mahasiswa").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return { data };
};

// Hapus mahasiswa
export const deleteMahasiswa = async (id) => {
  const { data, error } = await supabase.from("mahasiswa").delete().eq("id", id).select().single();
  if (error) throw error;
  return { data };
};