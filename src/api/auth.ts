import { sendGet, sendPost, sendPut } from "./axios";
import { IAuthResponse, IProfileResponse } from "@/interface/auth";

export const authApi = {
  login: (data: any) => sendPost("/auth/login", data),
  getProfile: (): Promise<IProfileResponse> => sendGet("/auth/profile"),
  updateProfile: (data: any) => sendPut("/auth/profile", data),
};
