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

export interface ILoginData {
    email: string;
    password: string;
}

export type LoginResponse = {
    user: IUser;
    jwtToken: string;
}

export enum APIStatus { IDLE, PENDING, REJECTED, FULFILLED }

export type APIError = {
    error: string;
    message: string;
    code: number;
}

export type APIData<DataType = any> = {
    status: APIStatus;
    error?: APIError;
    data?: DataType
}