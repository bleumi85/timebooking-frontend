import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertState, AlertType } from './alert.types';

// create slice
const name = 'alert';
const initialState: AlertState = createInitialState();
const reducers = createReducers();
const alertSlice = createSlice({ name, initialState, reducers });

// exports
export const alertActions = { ...alertSlice.actions };
export default alertSlice.reducer;

// implementation
function createInitialState(): AlertState {
    return {
        description: '',
        type: null
    }
}

function createReducers() {
    return {
        success,
        error,
    }

    function success(state: AlertState, action: PayloadAction<string | { title: string, description: string }>) {
        state.type = AlertType.SUCCESS;
        if (typeof action.payload === 'string') {
            state.description = action.payload;
        } else {
            state.description = action.payload.description;
            state.title = action.payload.title;
        }
    }

    function error(state: AlertState, action: PayloadAction<string | { title: string, description: string }>) {
        state.type = AlertType.ERROR;
        if (typeof action.payload === 'string') {
            state.description = action.payload;
        } else {
            state.description = action.payload.description;
            state.title = action.payload.title;
        }
    }
}