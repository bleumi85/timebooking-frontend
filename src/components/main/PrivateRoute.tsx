import { useAppSelector } from 'app/hooks';
import { Role } from 'common/types';
import { history } from 'helpers';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type PrivateRouteProps = {
    roles?: Role | Role[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
    const { user: authUser } = useAppSelector((x) => x.auth);

    if (!authUser) {
        // not logged in so redirect to register page with the return url
        return <Navigate to='/user/login' state={{ from: history.location }} />;
    }

    // check if route is restricted by role
    if (roles && roles.indexOf(authUser.role) === -1) {
        // role not authorized so redirect to home page
        return <Navigate to='/' />
    }

    return <Outlet />;
};

export default PrivateRoute;
