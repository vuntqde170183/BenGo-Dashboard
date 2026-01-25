import { sendGet, sendPut, sendDelete, sendPost } from "./axios";

export const adminUserApi = {
  getUsers: (params: any) => sendGet("/admin/users", params),
  getUserDetails: (id: string) => sendGet(`/admin/users/${id}`),
  createUser: (data: any) => sendPost("/admin/users", data),
  updateUser: (id: string, data: any) => sendPut(`/admin/users/${id}`, data),
  blockUser: (id: string, data: { blocked: boolean; reason: string }) => sendPut(`/admin/users/${id}/block`, data),
  deleteUser: (id: string) => sendDelete(`/admin/users/${id}`),
  updateUserRole: (id: string, data: { role: string; reason?: string; driverProfile?: any }) => sendPut(`/admin/users/${id}/role`, data),
};
