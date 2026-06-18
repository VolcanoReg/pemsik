import { useQuery } from "@tanstack/react-query";
import { getChartData } from "@/Utils/Apis/ChartApi";

export const useChart = () => {
  return useQuery({
    queryKey: ["chartData"],
    queryFn: async () => {
      const response = await getChartData();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 menit cache
  });
};
