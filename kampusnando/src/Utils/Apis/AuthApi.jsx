import { supabase } from "@/Utils/supabaseClient";

export const login = async (email, password) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    throw new Error("Email tidak ditemukan atau terjadi kesalahan");
  }

  if (data.password !== password) {
    throw new Error("Password salah");
  }

  return data;
};