import { AUTH_API } from "../Constants";
import { api } from "./axios";
import type { User } from "../types";

export interface GetUsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getAllUsersApi = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}): Promise<GetUsersResponse> => {
  const res = await api.get(AUTH_API.USERS, {
    params: {
      page,
      limit,
      search,
    },
  });

  return res.data;
};

export const updateUserApi = async ({
  id,
  role,
}: {
  id: string;
  role: string;
}) => {
  const res = await api.put(`/users/${id}`, { role });
  return res.data;
};

export const getProfileApi = async () => {
  const res = await api.get("/users/me");
  return res.data.user as User;
};

// UPDATE PROFILE
export const updateProfileApi = async (data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}) => {
  const res = await api.put("/users/me", data);
  return res.data.user as User;
};

// DELETE ACCOUNT
export const deleteAccountApi = async () => {
  const res = await api.delete("/users/me");
  return res.data;
};

// ADMIN → CREATE USER
export const createUserApi = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}) => {
  const res = await api.post(AUTH_API.USERS, data);
  return res.data;
};

// CHANGE PASSWORD
export const changePasswordApi = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await api.put("/users/me/password", data);
  return res.data;
};