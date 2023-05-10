import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { useAppSelector } from 'app/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { MdSchedule } from 'react-icons/md';
// import { RiAdminLine } from 'react-icons/ri';
import { adminLinks, userLinks } from './navLinks';
import CustomNavLink from './NavLink';
import { Link } from 'react-router-dom';
import { NavMenu } from './NavMenu';

const Nav: React.FC = () => {
    const { isOpen, onToggle } = useDisclosure();
    const { toggleColorMode } = useColorMode();

    const { user: authUser } = useAppSelector((state) => state.auth);
    const isAdmin = (authUser && authUser.role === 'Admin') || false;

    const Icon = useColorModeValue(MoonIcon, SunIcon);

    return (
        <MenuContainer isAdmin={isAdmin}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Logo />
                <IconButton
                    aria-label='Open Menu'
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    display={{ md: 'none' }}
                    onClick={onToggle}
                />
                <HStack
                    as='nav'
                    spacing={4}
                    display={{ base: 'none', md: 'flex' }}
                    flexGrow={1}
                    mx={8}
                >
                    {isAdmin &&
                        adminLinks.map(({ label, target }, idx) => (
                            <CustomNavLink key={idx} label={label} target={target} />
                        ))}
                    {authUser &&
                        userLinks.map(({ label, target }, idx) => (
                            <CustomNavLink key={idx} label={label} target={target} />
                        ))}
                </HStack>
                <Flex alignItems={'center'}>
                    <HStack spacing={5}>
                        <Button onClick={toggleColorMode} colorScheme={isAdmin ? 'red' : 'gray'}>
                            <Icon />
                        </Button>
                        {authUser ? (
                            <NavMenu authUser={authUser} />
                        ) : (
                            <CustomNavLink label='Login' target='/user/login' />
                        )}
                    </HStack>
                </Flex>
            </Flex>
        </MenuContainer>
    );
};

type MenuContainerProps = {
    children: React.ReactElement;
    isAdmin: boolean;
};

const MenuContainer: React.FC<MenuContainerProps> = ({ children, isAdmin }) => {
    const [menuHeight, setMenuHeight] = useState<number>(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const bgLight = isAdmin ? 'red.100' : 'white';
    const bgDark = isAdmin ? 'red.900' : 'gray.900';

    useEffect(() => {
        const handleResize = () => {
            if (menuRef.current) {
                setMenuHeight(menuRef.current.clientHeight);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
    }, []);

    return (
        <Box id='menuContainer'>
            <Box
                as='header'
                ref={menuRef}
                bg={useColorModeValue(bgLight, bgDark)}
                px={4}
                boxShadow={'md'}
                position={'fixed'}
                w={'100%'}
                zIndex={3}
            >
                {children}
            </Box>
            <Box h={`${menuHeight}px`} />
        </Box>
    );
};

const Logo = (): JSX.Element => (
    <Box>
        <Link to='/'>
            <HStack direction={'row'}>
                <MdSchedule size={28} />
                <Text as={'b'} fontSize={'lg'}>
                    ZEITEN
                </Text>
            </HStack>
        </Link>
    </Box>
);

export default Nav;
