import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import alertReducer from '../features/alert/alert.slice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
