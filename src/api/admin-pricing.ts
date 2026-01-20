import { sendGet, sendPut } from "./axios";
import { IPricingConfig } from "@/interface/admin";

export const adminPricingApi = {
  getPricing: (): Promise<IPricingConfig[]> => sendGet("/admin/pricing"),
  updatePricing: (vehicleType: string, data: any) =>
    sendPut(`/admin/pricing/${vehicleType}`, data),
};
