export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    role: 'Admin' | 'User' | 'Visitor';
    isVerified: boolean;
}

export interface IAuthState {
    user: IUser | null;
    jwtToken: string | null;
}

export type LoginData = {
    email: string;
    password: string;
};

export type LoginResponse = {
    user: IUser;
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
