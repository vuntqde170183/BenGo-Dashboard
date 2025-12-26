import { sendGet, sendPost, sendPut } from "./axios";
import { IAuthResponse, IProfileResponse } from "@/interface/auth";

export const authApi = {
  register: (data: any) => sendPost("/auth/register", data),
  login: (data: any) => sendPost("/auth/login", data),
  getProfile: (): Promise<IProfileResponse> => sendGet("/auth/profile"),
  updateProfile: (data: any) => sendPut("/auth/profile", data),
  forgotPassword: (phone: string) => sendPost("/auth/forgot-password", { phone }),
  resetPassword: (data: any) => sendPost("/auth/reset-password", data),
};
