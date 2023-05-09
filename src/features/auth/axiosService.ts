import axios, { AxiosResponse } from 'axios';
import { APIError, ILoginData, LoginResponse } from './types';

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
        ex.response.data.hasOwnProperty('message') && typeof ex.response.data.message === 'string' &&
        ex.response.data.hasOwnProperty('statusCode') && typeof ex.response.data.statusCode === 'number') {
        const { error, message, statusCode } = ex.response.data;
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

const axiosService = {
    login,
}

async function login(loginData: ILoginData) {
    var response = await publicRequest.post<LoginResponse>('/login', loginData);
    return response;
}

export default axiosService;
