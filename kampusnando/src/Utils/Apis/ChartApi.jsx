import { supabase } from "@/Utils/supabaseClient";

// Ambil data visualisasi statistik
export const getChartData = async () => {
  const { data, error } = await supabase
    .from("charts")
    .select("data")
    .eq("key", "chart")
    .single();

  if (error) throw error;
  
  // Kembalikan dalam struktur data Axios { data: ... }
  return { data: data.data };
};
