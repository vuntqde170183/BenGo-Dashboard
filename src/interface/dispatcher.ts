export type DispatcherOrderStatus = 'PENDING' | 'ACTIVE' | 'ALL' | 'COMPLETED' | 'CANCELLED';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type SpecialPriority = 'VIP' | 'URGENT' | 'FRAGILE';

export interface IDispatcherStats {
    totalOrders: number;
    pendingOrders: number;
    activeOrders: number;
    completedToday: number;
    onlineDrivers: number;
    openTickets: number;
}

export interface IDispatcherOrder {
    id: string;
    from: string;
    to: string;
    status: DispatcherOrderStatus;
    customerName: string;
    customerPhone: string;
    createdAt: string;
    priority?: string;
    specialNote?: string;
    tags?: string[];
    driverId?: string;
}

export interface IDriverMapLocation {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    status: 'ONLINE' | 'OFFLINE' | 'BUSY';
    phone: string;
}

export interface IDriverPerformance {
    driverId: string;
    totalTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    rating: number;
    totalEarnings: number;
    acceptanceRate: number;
}

export interface ISupportTicket {
    id: string;
    user: string;
    phone: string;
    content: string;
    status: TicketStatus;
    createdAt: string;
    orderId?: string;
    note?: string;
    resolution?: string;
}
