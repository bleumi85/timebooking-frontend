import { Flex, Stack } from '@chakra-ui/react';
import { useAppSelector } from 'app/hooks';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
    ForgotPassword,
    Login,
    Register,
    ResetPassword,
    VerifyEmail,
} from './';

const UserLayout: React.FC = () => {
    const { user: authUser } = useAppSelector((x) => x.auth);

    // redirect to home if already logged in
    if (authUser) {
        return <Navigate to="/" />;
    }

    return (
        <Flex
            flexDirection={'column'}
            width={'100wh'}
            height={'80vh'}
            justifyContent="center"
            alignItems={'center'}
        >
            <Stack
                flexDir={'column'}
                mb="2"
                justifyContent={'center'}
                alignItems="center"
                minW={{ base: '90%', md: '468px' }}
            >
                <Routes>
                    <Route
                        path="forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="verify-email" element={<VerifyEmail />} />
                </Routes>
            </Stack>
        </Flex>
    );
};

export default UserLayout;
