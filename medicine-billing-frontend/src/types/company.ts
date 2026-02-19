export type Company = {
  _id: string;
  userId: string;
  companyName: string;
  gstNumber: string;
  address?: string;
  phone?: string;
  email?: string;
  state?: string;
  logo?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
};
