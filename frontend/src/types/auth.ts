export type UserRole = 'student' | 'patient';

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  title?: string | null;
  institution?: string | null;
  auth_method: 'password' | 'otp' | 'google' | 'guest';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  role?: UserRole;
}

export interface OtpSendRequest {
  phone: string;
  role?: UserRole;
}

export interface OtpSendResponse {
  success: boolean;
  message: string;
  phone: string;
  expires_in_seconds: number;
  demo_otp?: string;
}

export interface OtpVerifyRequest {
  phone: string;
  otp: string;
  role?: UserRole;
}

export interface GoogleAuthRequest {
  email: string;
  name: string;
  picture?: string;
  id_token?: string;
  role?: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  institution?: string;
}
