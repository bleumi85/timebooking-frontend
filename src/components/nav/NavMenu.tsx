import {
    Avatar,
    Box,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { useAppDispatch } from 'app/hooks';
import { authActions } from 'features/auth/authSlice';
import { User } from 'features/auth/types';
import React, { useCallback } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

type NavMenuProps = {
    authUser: User;
};

export const NavMenu: React.FC<NavMenuProps> = ({ authUser }) => {
    const dispatch = useAppDispatch();

    const fullName = `${authUser.firstName} ${authUser.lastName}`;

    const logOut = useCallback(() => {
        dispatch(authActions.logout());
    }, [dispatch]);

    return (
        <Menu>
            <MenuButton py={2} transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
                <HStack>
                    <Avatar
                        bg={useColorModeValue('black', 'gray.700')}
                        name={fullName}
                        size={'sm'}
                    />
                    <VStack
                        display={{ base: 'none', md: 'flex' }}
                        alignItems='flex-start'
                        spacing='1px'
                        ml='2'
                    >
                        <Text fontSize='sm'>{fullName}</Text>
                        <Text fontSize='xs' color={useColorModeValue('gray.600', 'gray.400')}>
                            {authUser.role}
                        </Text>
                    </VStack>
                    <Box display={{ base: 'none', md: 'flex' }}>
                        <FiChevronDown />
                    </Box>
                </HStack>
            </MenuButton>
            <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
                <MenuLink to='/user/profile'>Profil</MenuLink>
                <MenuLink to='/settings'>Einstellungen</MenuLink>
                <MenuLink to='/pricing'>Preise</MenuLink>
                <MenuDivider />
                <MenuItem onClick={logOut}>Abmelden</MenuItem>
            </MenuList>
        </Menu>
    );
};

type MenuLinkProps = {
    children: string;
    to: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({ children, to }) => (
    <Link to={to}>
        <MenuItem>{children}</MenuItem>
    </Link>
);
