export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'DISPATCHER';

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

// Request interfaces for Quản lý người dùng
export interface ICreateUserBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
  studentId?: string;
  fullName?: string;
  phoneNumber?: string; // Legacy
  avatar?: string;
  role: string;
  department?: string;
  active: boolean;
}

export interface IUpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  studentId?: string;
  fullName?: string;
  phoneNumber?: string; // Legacy
  avatar?: string;
  role?: string;
  department?: string;
  active?: boolean;
}

// Upload response interface
export interface IUploadResponse {
  status: boolean;
  message: string;
  data: {
    url: string;
    filename?: string;
    size?: number;
  };
}
