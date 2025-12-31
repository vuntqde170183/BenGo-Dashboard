import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "@/api/admin-users";
import { adminDriverApi } from "@/api/admin-drivers";
import { adminOrderApi } from "@/api/admin-orders";
import { adminPricingApi } from "@/api/admin-pricing";
import { adminPromotionApi } from "@/api/admin-promotions";
import { adminTicketApi } from "@/api/admin-tickets";
import { adminReportApi } from "@/api/admin-reports";
import { toast } from "react-toastify";

// Quản lý người dùng
export const useAdminUsers = (params: any) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminUserApi.getUsers(params),
  });
};

export const useUserDetails = (id: string) => {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => adminUserApi.getUserDetails(id),
    enabled: !!id,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { blocked: boolean; reason: string } }) => adminUserApi.blockUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User status updated");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminUserApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted successfully");
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminUserApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User created successfully");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminUserApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User updated successfully");
    },
  });
};

// Alias for consistency with other components
export const useGetUserById = useUserDetails;


// Quản lý tài xế
export const useAdminDrivers = (params: any) => {
  return useQuery({
    queryKey: ["admin", "drivers", params],
    queryFn: () => adminDriverApi.getDrivers(params),
  });
};

export const useDriverDetails = (id: string) => {
  return useQuery({
    queryKey: ["admin", "drivers", id],
    queryFn: () => adminDriverApi.getDriverDetails(id),
    enabled: !!id,
  });
};

export const useApproveDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { driverId: string; action: 'APPROVE' | 'REJECT' }) => adminDriverApi.approveDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
      toast.success("Driver approval processed");
    },
  });
};

export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminDriverApi.updateDriverStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
      toast.success("Driver status updated");
    },
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDriverApi.deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
      toast.success("Driver deleted successfully");
    },
  });
};

// Order Management
export const useAdminOrders = (params: any) => {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: () => adminOrderApi.getOrders(params),
  });
};

export const useOrderDetails = (id: string) => {
  return useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: () => adminOrderApi.getOrderDetails(id),
    enabled: !!id,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminOrderApi.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order cancelled by admin");
    },
  });
};

// Pricing Config
export const usePricing = () => {
  return useQuery({
    queryKey: ["admin", "pricing"],
    queryFn: () => adminPricingApi.getPricing(),
  });
};

export const useUpdatePricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminPricingApi.updatePricing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });
      toast.success("Pricing configuration updated");
    },
  });
};

// Promotion Management
export const useAdminPromotions = (params?: any) => {
  return useQuery({
    queryKey: ["admin", "promotions", params],
    queryFn: () => adminPromotionApi.getPromotions(params),
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminPromotionApi.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promotions"] });
      toast.success("Promotion created successfully");
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminPromotionApi.updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promotions"] });
      toast.success("Promotion updated successfully");
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminPromotionApi.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "promotions"] });
      toast.success("Promotion deleted successfully");
    },
  });
};

// Ticket & Complaint Handling
export const useAdminTickets = (params: any) => {
  return useQuery({
    queryKey: ["admin", "tickets", params],
    queryFn: () => adminTicketApi.getTickets(params),
  });
};

export const useTicketDetails = (id: string) => {
  return useQuery({
    queryKey: ["admin", "tickets", id],
    queryFn: () => adminTicketApi.getTicketDetails(id),
    enabled: !!id,
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) => adminTicketApi.assignTicket(id, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
      toast.success("Ticket assigned successfully");
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; resolution: string } }) => adminTicketApi.updateTicketStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
      toast.success("Ticket status updated");
    },
  });
};

// Dashboard & Reports
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminReportApi.getDashboard(),
  });
};

export const useAdminReports = (type: string) => {
  return useQuery({
    queryKey: ["admin", "reports", type],
    queryFn: () => adminReportApi.getReports(type),
    enabled: !!type,
  });
};

