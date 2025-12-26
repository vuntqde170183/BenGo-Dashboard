export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'DISPATCHER';

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
