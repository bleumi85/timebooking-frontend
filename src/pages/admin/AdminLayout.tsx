import { Button, Heading, Stack, chakra } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AdminLinkProps, adminLinks } from './adminLinks';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { filterActions } from 'features/filter/filterSlice';
import { AreaType } from 'features/filter/filterTypes';
import { history } from 'helpers';
import { useGetLocationsQuery, useGetSchedulesQuery, useGetTasksQuery, useGetUsersQuery } from 'features/timebooking';

type loadingProps = {
    users: boolean;
    schedules: boolean;
    locations: boolean;
    tasks: boolean;
};

const AdminLayout: React.FC = () => {
    const dispatch = useAppDispatch();

    const changeArea = (area: AreaType) => {
        dispatch(filterActions.setArea(area))
    }

    const { area } = useAppSelector(state => state.filter);

    const [isLoading, setIsLoading] = useState<loadingProps>({
        users: false,
        schedules: false,
        locations: false,
        tasks: false,
    });

    useEffect(() => {
        if (history.navigate) {
            history.navigate(`/admin/${area}`);
        }
    }, [area]);

    return (
        <chakra.section id='adminSection'>
            <Stack direction='column' spacing={8}>
                <Stack direction={'column'} w={'100%'} spacing={4}>
                    <Heading>Admin-Bereich</Heading>
                    <Stack direction={'row'} spacing={4}>
                        {adminLinks.map(({ to, label, icon }, idx) => (
                            <AdminLink key={idx} to={to} label={label} icon={icon} changeArea={changeArea} isLoading={isLoading[to]} />
                        ))}
                    </Stack>
                </Stack>
                <OutletContainer setIsLoading={setIsLoading} />
            </Stack>
        </chakra.section>
    )
}

interface ExtendedAdminLinkProps extends AdminLinkProps {
    changeArea: (area: AreaType) => void;
    isLoading: boolean;
}

const AdminLink: React.FC<ExtendedAdminLinkProps> = ({ to, label, icon, changeArea, isLoading }) => (
    <NavLink to={to}>
        {({ isActive }) => (
            <Button
                variant={isActive ? 'solid' : 'outline'}
                onClick={() => changeArea(to)}
                colorScheme={'primary'}
                minW={150}
                leftIcon={icon({ fontSize: '1.25rem' })}
                isLoading={isActive && isLoading}
            >
                {label}
            </Button>
        )}
    </NavLink>
);

interface OutletContainerProps {
    setIsLoading: React.Dispatch<React.SetStateAction<loadingProps>>;
}

const OutletContainer: React.FC<OutletContainerProps> = ({ setIsLoading }) => {
    const { data: users, isLoading: usersIsLoading, error: usersError } = useGetUsersQuery();
    const { data: locations, isLoading: locationsIsLoading, error: locationsError } = useGetLocationsQuery();
    const { data: tasks, isLoading: tasksIsLoading, error: tasksError } = useGetTasksQuery();
    const { data: schedules, isLoading: schedulesIsLoading, error: schedulesError } = useGetSchedulesQuery();

    useEffect(() => {
        setIsLoading({
            users: usersIsLoading,
            schedules: schedulesIsLoading,
            locations: locationsIsLoading,
            tasks: tasksIsLoading,
        });
    }, [setIsLoading, usersIsLoading, locationsIsLoading, tasksIsLoading, schedulesIsLoading]);

    return (
        <Outlet context={{
            data: { users, locations, tasks, schedules },
            isLoading: { usersIsLoading, locationsIsLoading, tasksIsLoading, schedulesIsLoading },
            error: { usersError, locationsError, tasksError, schedulesError },
        }} />
    )
}

export default AdminLayout;
