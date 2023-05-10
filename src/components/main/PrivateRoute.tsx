import { useAppSelector } from 'app/hooks';
import { history } from 'helpers';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const { user: authUser } = useAppSelector((x) => x.auth);

    if (!authUser) {
        // not logged in so redirect to register page with the return url
        return <Navigate to="/user/login" state={{ from: history.location }} />;
    }

    return <Outlet />;
};

export default PrivateRoute;
