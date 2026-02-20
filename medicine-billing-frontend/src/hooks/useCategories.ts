import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoryByIdApi,
  getCategoryDropdownApi,
  getCategoriesApi,
  updateCategoryApi,
} from "../api/categoryApi";

export const useCategories = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ["categories", page, limit, search],
    queryFn: () =>
      getCategoriesApi({
        page,
        limit,
        search: search || undefined,
      }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 5,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryByIdApi(id),
    enabled: !!id,
  });
};

export const useCategoryDropdown = () => {
  return useQuery({
    queryKey: ["categories", "dropdown"],
    queryFn: getCategoryDropdownApi,
    staleTime: 1000 * 30,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategoryApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
