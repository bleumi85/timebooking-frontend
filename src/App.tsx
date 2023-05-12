import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Role } from 'common/types';
import { Layout, Page404, PrivateRoute } from 'components/main';
import UserLayout from 'features/auth';
import { history } from 'helpers';
import { Home } from 'pages';
import AdminLayout from 'pages/admin';
import AdminLocations from 'pages/admin/locations';
import AdminSchedules from 'pages/admin/schedules';
import AdminTasks from 'pages/admin/tasks';
import AdminUsers from 'pages/admin/users';
import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

library.add(fas);

const App: React.FC = () => {
    // init custom history object to allow navigation from
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <Layout>
            <Routes>
                {/* private */}
                <Route element={<PrivateRoute />}>
                    <Route path='/' element={<Home />} />
                </Route>
                <Route element={<PrivateRoute roles={Role.Admin} />}>
                    <Route path='admin' element={<AdminLayout />}>
                        <Route index element={null} />
                        <Route path='users' element={<AdminUsers />} />
                        <Route path='schedules' element={<AdminSchedules />} />
                        <Route path='locations' element={<AdminLocations />} />
                        <Route path='tasks' element={<AdminTasks />} />
                        <Route path='*' element={<Page404 />} />
                    </Route>
                </Route>
                {/* public */}
                <Route path='user/*' element={<UserLayout />} />
                <Route path='*' element={<div>404 PAGE</div>} />
            </Routes>
        </Layout>
    );
};

export default App;
