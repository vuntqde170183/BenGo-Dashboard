import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dispatcherApi } from "@/api/dispatcher";
import { toast } from "react-toastify";
import {
    DispatcherOrderStatus,
    TicketStatus,
    SpecialPriority
} from "@/interface/dispatcher";

// 1. Dashboard & Statistics
export const useDispatcherStats = () => {
    return useQuery({
        queryKey: ["dispatcher", "stats"],
        queryFn: () => dispatcherApi.getDashboardStats(),
    });
};

// 2. Order Management
export const useDispatcherOrders = (params: { status?: DispatcherOrderStatus }) => {
    return useQuery({
        queryKey: ["dispatcher", "orders", params],
        queryFn: () => dispatcherApi.getOrders(params),
    });
};

export const useDispatcherOrderDetails = (id: string) => {
    return useQuery({
        queryKey: ["dispatcher", "orders", id],
        queryFn: () => dispatcherApi.getOrderDetails(id),
        enabled: !!id,
    });
};

export const useAssignDriver = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { orderId: string; driverId: string }) => dispatcherApi.assignDriver(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dispatcher", "orders"] });
            toast.success("Điều phối tài xế thành công");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Điều phối tài xế thất bại");
        }
    });
};

// 3. Special Trip Management
export const useSpecialOrders = () => {
    return useQuery({
        queryKey: ["dispatcher", "orders", "special"],
        queryFn: () => dispatcherApi.getSpecialOrders(),
    });
};

export const useMarkOrderSpecial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { priority: SpecialPriority; specialNote?: string; tags?: string[] } }) =>
            dispatcherApi.markOrderSpecial(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dispatcher", "orders"] });
            toast.success("Đã đánh dấu đơn hàng đặc biệt");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Thao tác thất bại");
        }
    });
};

export const useUnmarkOrderSpecial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => dispatcherApi.unmarkOrderSpecial(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dispatcher", "orders"] });
            toast.success("Đã gỡ trạng thái đặc biệt");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Thao tác thất bại");
        }
    });
};

// 4. Driver Management
export const useDriverLocations = (params: { lat: number; lng: number; radius: number }) => {
    return useQuery({
        queryKey: ["dispatcher", "drivers", "locations", params],
        queryFn: () => dispatcherApi.getDriverLocations(params),
        enabled: !!params.lat && !!params.lng,
    });
};

export const useAllDrivers = () => {
    return useQuery({
        queryKey: ["dispatcher", "drivers", "all"],
        queryFn: () => dispatcherApi.getAllDrivers(),
    });
};

export const useDriverPerformance = (id: string, params: { from?: string; to?: string }) => {
    return useQuery({
        queryKey: ["dispatcher", "drivers", id, "performance", params],
        queryFn: () => dispatcherApi.getDriverPerformance(id, params),
        enabled: !!id,
    });
};

// 5. Support & Issue Tracking
export const useSupportTickets = (params: { status?: TicketStatus }) => {
    return useQuery({
        queryKey: ["dispatcher", "support", params],
        queryFn: () => dispatcherApi.getSupportTickets(params),
    });
};

export const useUpdateSupportTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { status: Exclude<TicketStatus, 'OPEN'>; note?: string; resolution?: string } }) =>
            dispatcherApi.updateSupportTicket(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dispatcher", "support"] });
            toast.success("Cập nhật khiếu nại thành công");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Cập nhật thất bại");
        }
    });
};
