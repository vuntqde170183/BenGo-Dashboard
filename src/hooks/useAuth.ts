import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => authApi.register(data),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: any) => authApi.login(data),
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (phone: string) => authApi.forgotPassword(phone),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: any) => authApi.resetPassword(data),
  });
};
