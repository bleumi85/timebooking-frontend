import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from 'app/store';
import { User } from 'features/auth/types';
import { Location, Schedule, Task } from './types';

const baseUrl = process.env.REACT_APP_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders(headers, { getState }) {
        const token = (getState() as RootState).auth.jwtToken;

        // If we have a token set in state, let's assume that we should be passing it.
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }

        return headers;
    },
    credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    let result = await baseQuery(args, api, extraOptions);

    return result;
}

const timebookingApi = createApi({
    reducerPath: 'timebooking',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Users', 'Locations', 'Tasks', 'Schedules'],
    endpoints: (build) => ({
        // Users
        getUsers: build.query<User[], void>({
            query: () => '/users',
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ id }) => ({ type: 'Users', id } as const)),
                        { type: 'Users', id: 'UsersLIST' }
                    ] : [{ type: 'Users', id: 'UsersLIST' }]
        }),
        deleteUser: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'delete'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        // Locations
        getLocations: build.query<Location[], void>({
            query: () => '/locations',
        }),
        deleteLocation: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/locations/${id}`,
                method: 'delete'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Locations', id }],
        }),
        // Tasks
        getTasks: build.query<Task[], void>({
            query: () => '/tasks'
        }),
        deleteTask: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'delete'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Tasks', id }],
        }),
        // Schedules
        getSchedules: build.query<Schedule[], void>({
            query: () => '/schedules'
        }),
        deleteSchedule: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/schedules/${id}`,
                method: 'delete'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Schedules', id }],
        }),
    }),
});

export const {
    useGetUsersQuery, useDeleteUserMutation,
    useGetLocationsQuery, useDeleteLocationMutation,
    useGetTasksQuery, useDeleteTaskMutation,
    useGetSchedulesQuery, useDeleteScheduleMutation,
} = timebookingApi;

export default timebookingApi;
