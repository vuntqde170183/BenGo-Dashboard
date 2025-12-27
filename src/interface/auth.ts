export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'DISPATCHER';

export interface IDepartment {
  _id: string;
  name: string;
  code: string;
}

export interface IUser {
  _id: string;
  id?: string; // Some endpoints use id, others use _id
  phone: string;
  email?: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  walletBalance?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields for admin user management
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

// Request interfaces for user management
export interface ICreateUserBody {
  name: string;
  email: string;
  password: string;
  studentId?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  role: string;
  department?: string;
  active: boolean;
}

export interface IUpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  studentId?: string;
  fullName?: string;
  phoneNumber?: string;
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
