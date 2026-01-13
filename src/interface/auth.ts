export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'DISPATCHER';
export type DriverStatus = 'PENDING' | 'APPROVED' | 'LOCKED' | 'REJECTED';

export interface IDepartment {
  _id: string;
  name: string;
  code: string;
}

export interface IUser {
  id: string;
  _id?: string;
  phone: string;
  email: string;
  name: string;
  role: UserRole;
  rating: number;
  walletBalance: number;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
  studentId?: string;
  fullName?: string;
  phoneNumber?: string;
  gender?: string;
  department?: IDepartment;
  active?: boolean;
}

export interface IAuthResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: IUser;
  };
}

export interface IProfileResponse {
  statusCode: number;
  message: string;
  data: IUser;
}

export type VehicleType = 'BIKE' | 'VAN' | 'TRUCK';

// Request interfaces for Quản lý người dùng
export interface ICreateUserBody {
  name: string;
  email?: string;
  password?: string;
  phone: string;
  avatar?: string;
  role: UserRole | string;
  active?: boolean;
  // Customer specific
  walletBalance?: number;
  rating?: number;
  fcmToken?: string;
  // Driver specific
  vehicleType?: VehicleType | string;
  plateNumber?: string;
  licenseImages?: string[];
  identityNumber?: string;
  identityFrontImage?: string;
  identityBackImage?: string;
  vehicleRegistrationImages?: string[];
  drivingLicenseNumber?: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  // Legacy or other
  studentId?: string;
  fullName?: string;
  department?: string;
}

export interface IUpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role?: UserRole | string;
  active?: boolean;
  // Customer specific
  walletBalance?: number;
  rating?: number;
  fcmToken?: string;
  // Driver specific
  vehicleType?: VehicleType | string;
  plateNumber?: string;
  licenseImages?: string[];
  identityNumber?: string;
  identityFrontImage?: string;
  identityBackImage?: string;
  vehicleRegistrationImages?: string[];
  drivingLicenseNumber?: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  // Legacy or other
  studentId?: string;
  fullName?: string;
  department?: string;
}

// Upload response interface
export interface IUploadResponse {
  statusCode: number;
  message: string;
  data: {
    statusCode: number;
    message: string;
    data: {
      public_id: string;
      url: string;
      width?: number;
      height?: number;
      format?: string;
      bytes?: number;
    };
  };
}

// Driver interfaces
export interface IDriver {
  _id: string;
  userId: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    rating?: number;
    avatar?: string;
  };
  plateNumber: string;
  vehicleType: string;
  status: DriverStatus;
  isOnline: boolean;
  rejectionReason?: string;
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

