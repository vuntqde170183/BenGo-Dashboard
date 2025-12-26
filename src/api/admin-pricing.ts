import { sendGet, sendPut } from "./axios";
import { IPricingConfig } from "@/interface/admin";

export const adminPricingApi = {
  getPricing: (): Promise<IPricingConfig[]> => sendGet("/admin/pricing"),
  updatePricing: (data: any) => sendPut("/admin/pricing", data),
};
