import { api } from "./axios";
import type { Company } from "../types/company";

export interface GetCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetCompaniesResponse {
  companies: Company[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getCompaniesApi = async (
  params: GetCompaniesParams
): Promise<GetCompaniesResponse> => {
  const { data } = await api.get("/companies", {
    params, // 👈 page, limit, search auto attach
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  return data;
};


export const createCompanyApi = async (formData: FormData) => {
  const { data } = await api.post("/companies", formData, {
  });

  return data;
};



export const updateCompanyApi = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const { data } = await api.put(`/companies/${id}`, formData);
  return data;
};

export const deleteCompanyApi = async (id: string) => {
  const { data } = await api.delete(`/companies/${id}`);
  return data;
};
