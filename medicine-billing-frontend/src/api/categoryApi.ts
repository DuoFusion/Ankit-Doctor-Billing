import { api } from "./axios";
import type {
  Category,
  CategoryDropdownItem,
  CreateCategoryPayload,
} from "../types/category";

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetCategoriesResponse {
  categories: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getCategoriesApi = async (
  params: GetCategoriesParams
): Promise<GetCategoriesResponse> => {
  const { data } = await api.get("/categories", { params });
  return data;
};

export const getCategoryByIdApi = async (id: string): Promise<Category> => {
  const { data } = await api.get(`/categories/${id}`);
  return data;
};

export const createCategoryApi = async (
  payload: CreateCategoryPayload
): Promise<{ message: string; category: Category }> => {
  const { data } = await api.post("/categories", payload);
  return data;
};

export const updateCategoryApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: CreateCategoryPayload;
}): Promise<{ message: string; category: Category }> => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
};

export const deleteCategoryApi = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

export const getCategoryDropdownApi = async (): Promise<CategoryDropdownItem[]> => {
  const { data } = await api.get("/categories/dropdown");
  return data;
};
