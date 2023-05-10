import { Location, NavigateFunction } from 'react-router-dom';

// custom history object to allow navigation outside react components
type tHistory = {
    navigate: null | NavigateFunction;
    location: null | Location;
};

export const history: tHistory = {
    navigate: null,
    location: null,
};
