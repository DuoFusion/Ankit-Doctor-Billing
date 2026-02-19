import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me");
        return res.data;
      } catch (err: any) {
        return null; 
      }
    },
    retry: false
  });
};

