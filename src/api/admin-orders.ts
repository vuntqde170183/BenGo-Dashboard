import { sendGet, sendPut } from "./axios";

export const adminOrderApi = {
  getOrders: (params: any) => sendGet("/admin/orders", params),
  getOrderDetails: (id: string) => sendGet(`/admin/orders/${id}`),
  cancelOrder: (id: string, reason: string) => sendPut(`/admin/orders/${id}/cancel`, { reason }),
};
