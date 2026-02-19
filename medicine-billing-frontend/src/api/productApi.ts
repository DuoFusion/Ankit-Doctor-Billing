import { api } from "./axios";

export const getProductsApi = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  productType?: string;
  companyId?: string;
  search?: string;
}) => {
  const { data } = await api.get("/products", {
    params,
  });
  return data;
};

// ✅ Get single product
export const getProductByIdApi = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};


export const createProductApi = async (formData: any) => {
  const { data } = await api.post("/products", formData);
  return data;
};

export const updateProductApi = ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  return api.put(`/products/${id}`, data).then(res => res.data);
};


export const deleteProductApi = async (id: string) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// api/products.ts
export const searchProductsApi = (search: string) =>
  api.get("/products", { params: { search, limit: 20 } })
     .then(res => res.data.products);
