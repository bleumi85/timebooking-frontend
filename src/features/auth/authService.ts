import axios, { AxiosResponse } from 'axios';
import { APIError, ForgotPasswordData, LoginData, LoginResponse, MessageResponse, RegisterData, ResetPasswordData } from './types';
import { store } from 'app/store';
import { alertActions } from 'features/alert/alert.slice';

export const InternalError = {
    error: 'Internal Server Error',
    message: 'Internal error during request',
    code: 500
}

export const onFulfilledRequest = (response: AxiosResponse) => response;
export const onRejectedResponse = (ex: any): Promise<APIError> => {
    if (typeof ex !== 'object') {
        return Promise.reject(InternalError)
    }

    if (ex.hasOwnProperty('response') && typeof ex.response === 'object' &&
        ex.response.hasOwnProperty('data') && typeof ex.response.data === 'object' &&
        ex.response.data.hasOwnProperty('error') && typeof ex.response.data.error === 'string' &&
        ex.response.data.hasOwnProperty('message') &&
        ex.response.data.hasOwnProperty('statusCode') && typeof ex.response.data.statusCode === 'number') {
        let { error, message, statusCode } = ex.response.data;
        if (typeof message === 'object') {
            message = message[0];
        }
        store.dispatch(alertActions.error({ title: error, description: message }))
        return Promise.reject({
            error: error,
            message: message,
            code: statusCode
        })
    }

    return Promise.reject(InternalError);
}

const publicRequest = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/auth`,
});

publicRequest.interceptors.response.use(onFulfilledRequest, onRejectedResponse);

const authService = {
    forgotPassword,
    login,
    register,
    resetPassword,
    validateResetToken,
    verifyEmail,
}

async function login(loginData: LoginData) {
    return await publicRequest.post<LoginResponse>('/login', loginData);
}

async function forgotPassword(forgotPasswordData: ForgotPasswordData) {
    return await publicRequest.post<MessageResponse>('/forgot-password', forgotPasswordData);
}

async function register(registerData: RegisterData) {
    return await publicRequest.post<MessageResponse>('/register', registerData);
}

async function resetPassword(resetPasswordData: ResetPasswordData, token: string) {
    return await publicRequest.post<MessageResponse>('/reset-password', { ...resetPasswordData, token })
}

async function validateResetToken(token: string) {
    return await publicRequest.post('/validate-reset-token', { token });
}

async function verifyEmail(token: string) {
    return await publicRequest.post('/verify-email', { token });
}

export default authService;
