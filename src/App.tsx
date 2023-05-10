import { Layout, PrivateRoute } from 'components/main';
import UserLayout from 'features/auth';
import { history } from 'helpers';
import { Home } from 'pages';
import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

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
                {/* public */}
                <Route path='user/*' element={<UserLayout />} />
            </Routes>
        </Layout>
    );
};

export default App;
