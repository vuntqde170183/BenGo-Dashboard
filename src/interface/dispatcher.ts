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
    _id: string;
    customerId: {
        _id: string;
        name: string;
        phone: string;
    };
    driverId?: {
        _id: string;
        name: string;
        phone: string;
    };
    pickup: {
        address: string;
        lat: number;
        lng: number;
        _id?: string;
    };
    dropoff: {
        address: string;
        lat: number;
        lng: number;
        _id?: string;
    };
    vehicleType: string;
    goodsImages?: string[];
    status: string;
    totalPrice: number;
    distanceKm: number;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt?: string;
    priority?: string;
    specialNote?: string;
    tags?: string[];
}

export interface IDriverMapLocation {
    id: string;
    name: string;
    userId?: {
        _id: string;
        phone: string;
        name: string;
    };
    location: {
        lat: number;
        lng: number;
    };
    status: 'ONLINE' | 'OFFLINE' | 'BUSY';
    phone?: string;
    rating?: number;
    vehicleType?: string;
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

export interface IAssignmentHistory {
    _id: string;
    orderId: {
        _id: string;
        totalPrice: number;
        pickup: {
            address: string;
        };
        dropoff: {
            address: string;
        };
        vehicleType: string;
        distanceKm: number;
        priority?: string;
    };
    driverId: {
        _id: string;
        userId?: {
            _id: string;
            name: string;
            phone?: string;
            email?: string;
        };
        plateNumber?: string;
        vehicleType?: string;
    };
    dispatcherId: {
        _id: string;
        name: string;
        phone: string;
    };
    status: string;
    createdAt: string;
}
