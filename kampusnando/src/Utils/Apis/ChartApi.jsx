import axios from "@/Utils/AxiosInstance";

// Ambil data visualisasi statistik
export const getChartData = () => {
  return axios.get("/chart");
};
