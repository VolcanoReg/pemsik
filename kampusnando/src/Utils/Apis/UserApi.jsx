import { supabase } from "@/Utils/supabaseClient";

// Ambil semua user
export const getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return { data };
};

// Update role dan permission user
export const updateUserRolePermission = async (id, payload) => {
  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return { data };
};
