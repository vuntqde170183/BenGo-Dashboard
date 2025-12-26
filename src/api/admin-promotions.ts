import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const adminPromotionApi = {
  getPromotions: (params: any) => sendGet("/admin/promotions", params),
  createPromotion: (data: any) => sendPost("/admin/promotions", data),
  updatePromotion: (id: string, data: any) => sendPut(`/admin/promotions/${id}`, data),
  deletePromotion: (id: string) => sendDelete(`/admin/promotions/${id}`),
};
