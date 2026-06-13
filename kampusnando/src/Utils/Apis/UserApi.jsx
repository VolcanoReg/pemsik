import axios from "@/Utils/AxiosInstance";

// Ambil semua user
export const getAllUsers = () => axios.get("/user");

// Update role dan permission user
export const updateUserRolePermission = (id, data) => axios.patch(`/user/${id}`, data);
