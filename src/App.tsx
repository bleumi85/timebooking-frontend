import { Layout, PrivateRoute } from 'components/main';
import UserLayout from 'features/auth';
import { Home } from 'pages';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* private */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        {/* public */}
        <Route path="user/*" element={<UserLayout />} />
      </Routes>
    </Layout>
  );
};

export default App;
