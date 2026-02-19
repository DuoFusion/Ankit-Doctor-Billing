import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  getBillsApi,
  getBillByIdApi,
  createBillApi,
  deleteBillApi,
} from "../api/billApi";

/* ======================
   LIST BILLS
====================== */
export const useBills = (
  page: number,
  limit: number,
  search: string
) =>
  useQuery({
    queryKey: ["bills", page, limit, search],
    queryFn: () =>
      getBillsApi({
        page,
        limit,
        search,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 5, // ✅ optional but recommended
  });

/* ======================
   SINGLE BILL
====================== */
export const useBill = (id?: string) =>
  useQuery({
    queryKey: ["bill", id],
    queryFn: () => getBillByIdApi(id!),
    enabled: !!id,
  });

/* ======================
   CREATE BILL
====================== */
export const useCreateBill = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createBillApi,

    onSuccess: () => {
      // ✅ refresh bill list
      qc.invalidateQueries({
        queryKey: ["bills"],
      });
    },

    onError: (err: any) => {
      console.error("Create Bill Error 👉", err?.response?.data || err);
    },
  });
};

/* ======================
   DELETE BILL
====================== */
export const useDeleteBill = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteBillApi,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["bills"],
      });
    },
  });
};
