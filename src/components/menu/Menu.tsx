import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, IconButton, Text, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MdSchedule } from 'react-icons/md';
// import { RiAdminLine } from 'react-icons/ri';
import { adminLinks, userLinks } from './menuLinks';
import MenuLink from './MenuLink';
import { authActions } from 'features/auth/authSlice';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
    const { isOpen, onToggle } = useDisclosure();
    const { toggleColorMode } = useColorMode();

    const dispatch = useAppDispatch();
    const { user: authUser } = useAppSelector(state => state.auth);
    const isAdmin = (authUser && authUser.role === 'Admin') || false;

    const Icon = useColorModeValue(MoonIcon, SunIcon);

    const logOut = useCallback(() => {
        dispatch(authActions.logout())
    }, [dispatch]);

    return (
        <MenuContainer isAdmin={isAdmin}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Logo />
                <IconButton
                    aria-label="Open Menu"
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    display={{ md: 'none' }}
                    onClick={onToggle}
                />
                <HStack as='nav' spacing={4} display={{ base: 'none', md: 'flex' }} flexGrow={1} mx={8}>
                    {isAdmin && adminLinks.map(({ label, target }, idx) => (
                        <MenuLink key={idx} label={label} target={target} />
                    ))}
                    {authUser && userLinks.map(({ label, target }, idx) => (
                        <MenuLink key={idx} label={label} target={target} />
                    ))}
                </HStack>
                <Flex alignItems={'center'}>
                    <HStack spacing={5}>
                        <Button onClick={toggleColorMode} colorScheme={isAdmin ? 'red' : 'gray'}>
                            <Icon />
                        </Button>
                        {authUser ? (
                            <Box display={'block'} onClick={logOut}>Abmelden</Box>
                        ) : (
                            <MenuLink label='Login' target='/user/login' />
                        )}
                    </HStack>
                </Flex>
            </Flex>
        </MenuContainer>
    )
}

type MenuContainerProps = {
    children: React.ReactElement;
    isAdmin: boolean;
}

const MenuContainer: React.FC<MenuContainerProps> = ({ children, isAdmin }) => {
    const [menuHeight, setMenuHeight] = useState<number>(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const bgLight = isAdmin ? 'red.100' : 'white';
    const bgDark = isAdmin ? 'red.900' : 'gray.900';
    const color = isAdmin ? 'red.600' : 'primary.500';

    useEffect(() => {
        const handleResize = () => {
            if (menuRef.current) {
                setMenuHeight(menuRef.current.clientHeight);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
    }, []);

    return (
        <Box id="menuContainer">
            <Box
                as='header'
                ref={menuRef}
                bg={useColorModeValue(bgLight, bgDark)}
                px={4}
                boxShadow={'md'}
                position={'fixed'}
                w={'100%'}
                zIndex={3}
                color={useColorModeValue(color, 'white')}
            >
                {children}
            </Box>
            <Box h={`${menuHeight}px`} />
        </Box>
    )
}

const Logo = (): JSX.Element => (
    <Box>
        <Link to="/">
            <HStack direction={'row'}>
                <MdSchedule size={28} />
                <Text as={'b'} fontSize={'lg'}>
                    ZEITEN
                </Text>
            </HStack>
        </Link>
    </Box>
)

export default Menu;