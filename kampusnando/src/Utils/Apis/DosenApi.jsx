import { supabase, handleRequest } from "@/Utils/supabaseClient";

// Ambil semua dosen
export const getAllDosen = (params = {}) => handleRequest("dosen", params, ["nama", "nidn"]);

// Ambil 1 dosen
export const getDosen = async (id) => {
  const { data, error } = await supabase.from("dosen").select("*").eq("id", id).single();
  if (error) throw error;
  return { data };
};

// Tambah dosen
export const storeDosen = async (payload) => {
  const { data, error } = await supabase.from("dosen").insert(payload).select().single();
  if (error) throw error;
  return { data };
};

// Update dosen
export const updateDosen = async (id, payload) => {
  const { data, error } = await supabase.from("dosen").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return { data };
};

// Hapus dosen
export const deleteDosen = async (id) => {
  const { data, error } = await supabase.from("dosen").delete().eq("id", id).select().single();
  if (error) throw error;
  return { data };
};
