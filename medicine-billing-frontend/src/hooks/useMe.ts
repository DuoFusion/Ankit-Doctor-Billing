import { useQuery } from "@tanstack/react-query";
import { api } from "../Api/axios";
import { AUTH_API, QUERY_KEYS } from "../Constants";

export const useMe = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      try {
        const res = await api.get(AUTH_API.ME);
        return res.data;
      } catch (err: any) {
        return null; 
      }
    },
    retry: false
  });
};

