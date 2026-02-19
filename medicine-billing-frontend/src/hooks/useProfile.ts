import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfileApi ,updateProfileApi,deleteAccountApi} from "../api/userApi";



export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      window.location.href = "/login";
    },
  });
};