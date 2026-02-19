/* =====================
   BILL TYPES
===================== */

export interface BillItem {
  _id: string;
  productName: string;
  qty: number;
  rate: number;
  total: number;
}

export interface Company {
  companyName: string;
  gstNo?: string;
}

export interface Bill {
  billNo: string;
  companyId?: Company;
  grandTotal: number;
}

export interface BillResponse {
  bill: Bill;
  items: BillItem[];
}
