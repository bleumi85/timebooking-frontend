import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ForgotPasswordData, AuthState, LoginData, LoginResponse, RegisterData } from './types';
import authService from './authService';
import { alertActions } from 'features/alert/alert.slice';
import { history } from 'helpers';

// create slice

const name = 'auth';
const initialState: AuthState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const authSlice = createSlice({ name, initialState, reducers });

// exports
export const authActions = { ...authSlice.actions, ...extraActions };
export default authSlice.reducer;

// implementation

function createInitialState(): AuthState {
    const storedAuthData = localStorage.getItem('jbl.development.auth');
    let parsedAuthData: AuthState | null = null;
    if (storedAuthData) {
        parsedAuthData = JSON.parse(storedAuthData) as AuthState;
    }

    return parsedAuthData || { user: null, jwtToken: null };
}

function createReducers() {
    return {
        setAuthData,
        logout,
    };

    function logout(state: AuthState) {
        state.user = null;
        state.jwtToken = null;
        localStorage.removeItem('jbl.development.auth');
        history.navigate && history.navigate('/user/login');
    }

    function setAuthData(
        state: AuthState,
        action: PayloadAction<{ user: AuthState['user']; jwtToken: string }>,
    ) {
        state.user = action.payload.user;
        state.jwtToken = action.payload.jwtToken;
    }
}

function createExtraActions() {
    return {
        forgotPassword: forgotPassword(),
        login: login(),
        register: register(),
    };

    function forgotPassword() {
        return createAsyncThunk<void, ForgotPasswordData>(
            `${name}/forgot-password`,
            async (forgotPasswordData: ForgotPasswordData, { dispatch }) => {
                const { data } = await authService.forgotPassword(forgotPasswordData);

                dispatch(alertActions.success(data.message));
            },
        );
    }

    function login() {
        return createAsyncThunk<LoginResponse, LoginData>(
            `${name}/login`,
            async (loginData: LoginData, { dispatch }) => {
                const { data } = await authService.login(loginData);

                // set auth user in redux store
                dispatch(authActions.setAuthData(data));

                if (history.navigate) {
                    history.navigate('/');
                }

                // store account details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('jbl.development.auth', JSON.stringify(data));

                return data;
            },
        );
    }

    function register() {
        return createAsyncThunk<void, RegisterData>(
            `${name}/register`,
            async (registerData: RegisterData, { dispatch }) => {
                const { data } = await authService.register(registerData);

                dispatch(alertActions.success(data.message));
            },
        );
    }
}
