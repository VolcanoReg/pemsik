import axios from "@/Utils/AxiosInstance";

// Ambil semua mata kuliah
export const getAllMataKuliah = () => axios.get("/matakuliah");

// Ambil 1 mata kuliah
export const getMataKuliah = (id) => axios.get(`/matakuliah/${id}`);

// Tambah mata kuliah
export const storeMataKuliah = (data) => axios.post("/matakuliah", data);

// Update mata kuliah
export const updateMataKuliah = (id, data) => axios.put(`/matakuliah/${id}`, data);

// Hapus mata kuliah
export const deleteMataKuliah = (id) => axios.delete(`/matakuliah/${id}`);
