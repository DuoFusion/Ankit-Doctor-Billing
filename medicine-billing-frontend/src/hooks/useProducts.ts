// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getProductByIdApi,
} from "../api/productApi";

/* -------- GET (LIST) -------- */
export const useProducts = (
  page: number,
  limit: number = 10,
  search: string = ""
) => {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: () =>
      getProductsApi({
        page,
        limit,
        search: search || undefined,
      }),

    placeholderData: (prev) => prev,
    staleTime: 1000 * 5,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductByIdApi(id),
    enabled: !!id,
  });
};

/* -------- CREATE -------- */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

/* -------- UPDATE -------- */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.id],
      });
    },
  });
};


/* -------- DELETE -------- */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
