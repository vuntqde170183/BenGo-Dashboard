import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const adminDriverApi = {
  getDrivers: (params: any) => sendGet("/admin/drivers", params),
  getDriverDetails: (id: string) => sendGet(`/admin/drivers/${id}`),
  approveDriver: (data: { driverId: string; action: 'APPROVE' | 'REJECT' }) => sendPost("/admin/drivers/approval", data),
  updateDriverStatus: (id: string, data: { status: string }) => sendPut(`/admin/drivers/${id}/status`, data),
  deleteDriver: (id: string) => sendDelete(`/admin/drivers/${id}`),
};
