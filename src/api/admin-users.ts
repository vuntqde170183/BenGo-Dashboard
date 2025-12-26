import { sendGet, sendPut, sendDelete } from "./axios";

export const adminUserApi = {
  getUsers: (params: any) => sendGet("/admin/users", params),
  getUserDetails: (id: string) => sendGet(`/admin/users/${id}`),
  blockUser: (id: string, data: { blocked: boolean; reason: string }) => sendPut(`/admin/users/${id}/block`, data),
  deleteUser: (id: string) => sendDelete(`/admin/users/${id}`),
};
