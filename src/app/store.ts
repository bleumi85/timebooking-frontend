import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

// reducers
import alertReducer from '../features/alert/alert.slice';
import authReducer from '../features/auth/authSlice';
import filterReducer from '../features/filter/filterSlice';

// apis
import timebookingApi from 'features/timebooking';

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer,
        filter: filterReducer,
        [timebookingApi.reducerPath]: timebookingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            timebookingApi.middleware
        ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
