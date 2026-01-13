
export type DriverStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'LOCKED';
export type VehicleType = 'BIKE' | 'VAN' | 'TRUCK';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface IDriver {
  _id: string;
  userId: {
    name: string;
    phone: string;
    email: string;
    rating: number;
  };
  vehicleType: VehicleType;
  plateNumber: string;
  licenseImage: string;
  isOnline: boolean;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  status: DriverStatus;
}

export interface IOrder {
  _id: string;
  customerId: {
    name: string;
    phone: string;
  };
  driverId: {
    name: string;
    phone: string;
  } | null;
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
  };
  vehicleType: VehicleType;
  status: OrderStatus;
  totalPrice: number;
  distanceKm: number;
  paymentMethod: 'CASH' | 'WALLET' | 'QR';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
}

export interface IPricingConfig {
  _id: string;
  vehicleType: VehicleType;
  basePrice: number;
  perKm: number;
  peakHourMultiplier: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPromotion {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableVehicles: VehicleType[];
}

export interface ITicket {
  _id: string;
  userId: {
    name: string;
    phone: string;
    email: string;
  };
  subject: string;
  content: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: string | null;
  createdAt: string;
}

export interface IReportResponse {
  revenue: {
    daily: number;
    monthly: number;
  };
}

export interface IDashboardOverview {
  users: number;
  drivers: number;
  orders: number;
  activeOrders: number;
  revenue: number;
  pendingTickets: number;
}
