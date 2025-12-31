import { sendGet, sendPut, sendDelete } from "./axios";

export interface UpdateDriverStatusDto {
  driverId: string;
  status: 'APPROVED' | 'PENDING' | 'LOCKED' | 'REJECTED';
  reason?: string;
  note?: string;
}

export const adminDriverApi = {
  getDrivers: (params: any) => sendGet("/admin/drivers", params),
  getDriverDetails: (id: string) => sendGet(`/admin/drivers/${id}`),
  updateDriverStatus: (data: UpdateDriverStatusDto) => sendPut("/admin/drivers/status", data),
  deleteDriver: (id: string) => sendDelete(`/admin/drivers/${id}`),
};
