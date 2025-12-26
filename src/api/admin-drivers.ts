import { sendGet, sendPost } from "./axios";

export const adminDriverApi = {
  getDrivers: (params: any) => sendGet("/admin/drivers", params),
  approveDriver: (data: { driverId: string; action: 'APPROVE' | 'REJECT' }) => sendPost("/admin/drivers/approval", data),
};
