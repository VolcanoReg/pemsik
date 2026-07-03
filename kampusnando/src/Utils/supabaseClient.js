import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing in environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handleRequest(tableName, params = {}, searchFields = []) {
  let query = supabase.from(tableName).select("*", { count: "exact" });

  // 1. Filtering / Search (q parameter)
  if (params.q && searchFields.length > 0) {
    const filters = searchFields.map(field => `${field}.ilike.%${params.q}%`).join(",");
    query = query.or(filters);
  }

  // 2. Sorting
  if (params._sort) {
    const order = params._order?.toLowerCase() === "desc" ? { ascending: false } : { ascending: true };
    query = query.order(params._sort, order);
  }

  // 3. Pagination
  let from = null;
  let to = null;
  if (params._page && params._limit) {
    const page = parseInt(params._page, 10);
    const limit = parseInt(params._limit, 10);
    from = (page - 1) * limit;
    to = from + limit - 1;
  }

  // Execute query with range if applicable
  const { data, error, count } = await (from !== null && to !== null
    ? query.range(from, to)
    : query);

  if (error) {
    throw error;
  }

  return {
    data,
    headers: {
      "x-total-count": String(count || 0)
    }
  };
}
