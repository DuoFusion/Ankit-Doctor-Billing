import { api } from "./axios";

/* =========================
   GET ALL BILLS
========================= */
export const getBillsApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { data } = await api.get("/bills", { params });
  return data;
};

/* =========================
   GET BILL BY ID
========================= */
export const getBillByIdApi = async (id: string) => {
  const { data } = await api.get(`/bills/${id}`);
  return data;
};

/* =========================
   CREATE BILL
========================= */
export const createBillApi = async (payload: {
  companyId: string;
  discount?: number;
  items: {
    productId: string;
    qty: number;
    freeQty?: number;
    rate: number;
    taxPercent: number;
    discount?: number;
  }[];
}) => {
  try {
    const { data } = await api.post("/bills", {
      ...payload,
      discount: payload.discount || 0,
    });

    return data;
  } catch (err: any) {
    // 🔴 IMPORTANT: backend error expose
    console.error("Create Bill Error:", err.response?.data);

    throw new Error(
      err.response?.data?.message || "Failed to create bill"
    );
  }
};

/* =========================
   DELETE BILL
========================= */
export const deleteBillApi = async (id: string) => {
  const { data } = await api.delete(`/bills/${id}`);
  return data;
};

/* =========================
   UPDATE BILL
========================= */
export const updateBillApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: {
    discount: number;
    companyId?: string;
    items?: {
      productId: string;
      qty: number;
      freeQty?: number;
      rate: number;
      taxPercent: number;
      discount?: number;
    }[];
  };
}) => {
  const { data } = await api.put(`/bills/${id}`, payload);
  return data;
};
