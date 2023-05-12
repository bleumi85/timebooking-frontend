import { Role } from 'common/types';

export interface MinimalUser {
    id: string;
    firstName: string;
    lastName: string;
}

export interface User extends MinimalUser {
    userName: string;
    email: string;
    role: Role;
    isVerified: boolean;
}

export type AuthState = {
    user: User | null;
    jwtToken: string | null;
}

export type LoginData = {
    email: string;
    password: string;
};

export type LoginResponse = {
    user: User;
    jwtToken: string;
};

export type RegisterData = {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
};

export enum APIStatus {
    IDLE,
    PENDING,
    REJECTED,
    FULFILLED,
}

export type APIError = {
    error: string;
    message: string;
    code: number;
};

export type APIData<DataType = any> = {
    status: APIStatus;
    error?: APIError;
    data?: DataType;
};

export type MessageResponse = {
    message: string;
};

export type ForgotPasswordData = {
    email: string;
};

export type ResetPasswordData = {
    password: string;
    confirmPassword: string;
};
