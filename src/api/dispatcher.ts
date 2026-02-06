import {
    IDispatcherStats,
    IDispatcherOrder,
    IDriverMapLocation,
    IDriverPerformance,
    ISupportTicket,
    DispatcherOrderStatus,
    TicketStatus,
    SpecialPriority
} from "@/interface/dispatcher";
import { sendGet, sendPost, sendPut } from "./axios";

export const dispatcherApi = {
    // 1. Dashboard & Statistics
    getDashboardStats: (): Promise<IDispatcherStats> =>
        sendGet("/dispatcher/dashboard/stats").then(res => res.data),

    // 2. Order Management
    getOrders: (params: { status?: DispatcherOrderStatus }): Promise<IDispatcherOrder[]> =>
        sendGet("/dispatcher/orders", params).then(res => res.data),

    getOrderDetails: (id: string): Promise<IDispatcherOrder> =>
        sendGet(`/dispatcher/orders/${id}`).then(res => res.data),

    assignDriver: (data: { orderId: string; driverId: string }) =>
        sendPost("/dispatcher/assign", data),

    // 3. Special Trip Management
    getSpecialOrders: (): Promise<IDispatcherOrder[]> =>
        sendGet("/dispatcher/orders/special").then(res => res.data),

    markOrderSpecial: (id: string, data: { priority: SpecialPriority; specialNote?: string; tags?: string[] }) =>
        sendPost(`/dispatcher/orders/${id}/mark-special`, data),

    unmarkOrderSpecial: (id: string) =>
        sendPost(`/dispatcher/orders/${id}/unmark-special`, {}),

    // 4. Driver Management
    getDriverLocations: (params: { lat: number; lng: number; radius: number }): Promise<IDriverMapLocation[]> =>
        sendGet("/dispatcher/drivers", params).then(res => res.data),

    getAllDrivers: (): Promise<IDriverMapLocation[]> =>
        sendGet("/dispatcher/drivers/all").then(res => res.data),

    getDriverPerformance: (id: string, params: { from?: string; to?: string }): Promise<IDriverPerformance> =>
        sendGet(`/dispatcher/drivers/${id}/performance`, params).then(res => res.data),

    // 5. Support & Issue Tracking
    getSupportTickets: (params: { status?: TicketStatus }): Promise<ISupportTicket[]> =>
        sendGet("/dispatcher/support", params).then(res => res.data),

    updateSupportTicket: (id: string, data: { status: Exclude<TicketStatus, 'OPEN'>; note?: string; resolution?: string }) =>
        sendPut(`/dispatcher/support/${id}`, data),
};
