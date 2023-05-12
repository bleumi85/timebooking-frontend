import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, AreaType } from './filterTypes';

// create slice
const name = 'filter';
const initialState: FilterState = createInitialState();
const reducers = createReducers();
const filterSlice = createSlice({ name, initialState, reducers });

// exports
export const filterActions = { ...filterSlice.actions };
export default filterSlice.reducer;

// implementation
function createInitialState(): FilterState {
    return {
        area: AreaType.USERS,
    };
}

function createReducers() {
    return {
        setArea,
    };

    function setArea(
        state: FilterState,
        action: PayloadAction<AreaType>,
    ) {
        state.area = action.payload;
    }
}
