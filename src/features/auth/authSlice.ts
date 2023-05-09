import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIError, IAuthState, ILoginData, LoginResponse } from './types';
// import authService from './authService';
import axiosService, { InternalError } from './axiosService';
import { alertActions } from 'features/alert/alert.slice';

// create slice

const name = 'auth';
const initialState: IAuthState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const authSlice = createSlice({ name, initialState, reducers });

// exports
export const authActions = { ...authSlice.actions, ...extraActions };
export default authSlice.reducer;

// implementation

function createInitialState(): IAuthState {
    const storedAuthData = localStorage.getItem('jbl.development.auth');
    let parsedAuthData: IAuthState | null = null;
    if (storedAuthData) {
        parsedAuthData = JSON.parse(storedAuthData) as IAuthState;
    }

    return parsedAuthData || { user: null, jwtToken: null }
}

function createReducers() {
    return {
        setAuthData,
    }

    function setAuthData(state: IAuthState, action: PayloadAction<{ user: IAuthState['user']; jwtToken: string }>) {
        state.user = action.payload.user;
        state.jwtToken = action.payload.jwtToken;
    }
}

function createExtraActions() {

    return {
        forgetPassword: forgotPassword(),
        login: login(),
    }

    function forgotPassword() {

    }

    function login() {
        return createAsyncThunk<LoginResponse, ILoginData, { rejectValue: APIError }>(
            `${name}/login`,
            async (loginData: ILoginData, { dispatch, rejectWithValue }) => {
                try {
                    const { data } = await axiosService.login(loginData);

                    // set auth user in redux store
                    dispatch(authActions.setAuthData(data));

                    // store account details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('jbl.development.auth', JSON.stringify(data));

                    return data;
                } catch (ex) {
                    const payload = getExceptionPayload(ex);
                    dispatch(alertActions.error({ title: payload.error, description: payload.message }));
                    return rejectWithValue(payload);
                }
            }
        )
    }
}

const getExceptionPayload = (ex: unknown): APIError => {
    console.log({ foo: typeof ex })

    if (typeof ex !== "object" || !ex) {
        return InternalError;
    }

    const typedException = ex as APIError;
    if (ex.hasOwnProperty('error') && typeof typedException.error === 'string' &&
        ex.hasOwnProperty('message') && typeof typedException.message === 'string' &&
        ex.hasOwnProperty('code') && typeof typedException.code === 'number') {
        return {
            error: typedException.error,
            message: typedException.message,
            code: typedException.code
        };
    }

    return InternalError;
}
