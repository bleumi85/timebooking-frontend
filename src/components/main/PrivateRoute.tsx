import React from 'react';
import { Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  return <Outlet />;
};

export default PrivateRoute;
