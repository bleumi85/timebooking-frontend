import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ForgotPassword, Login, Register, ResetPassword, VerifyEmail } from './';
import { PrivateRoute } from 'components/main';
import { UserProfile } from './UserProfile';

const UserLayout: React.FC = () => (
    <Flex
        flexDirection={'column'}
        width={'100wh'}
        height={'80vh'}
        justifyContent='center'
        alignItems={'center'}
    >
        <Stack
            flexDir={'column'}
            mb='2'
            justifyContent={'center'}
            alignItems='center'
            minW={{ base: '90%', md: '468px' }}
        >
            <Routes>
                <Route path='forgot-password' element={<ForgotPassword />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='reset-password' element={<ResetPassword />} />
                <Route path='verify-email' element={<VerifyEmail />} />
                <Route element={<PrivateRoute />}>
                    <Route path='profile' element={<UserProfile />} />
                </Route>
            </Routes>
        </Stack>
    </Flex>
);

export default UserLayout;
