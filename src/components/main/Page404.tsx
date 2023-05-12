import { Button, Container, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { history } from 'helpers';
import React from 'react';
import { Link } from 'react-router-dom';

const Page404: React.FC = () => (
    <Container maxW={'container.2xl'} p={8} mt={4} bg={useColorModeValue('white', 'gray.900')} boxShadow={'md'} borderRadius={8}>
        <Stack direction='column' maxW='container.sm' spacing={4}>
            <Heading size='4xl'>Hmmm.</Heading>
            <Text fontSize='2xl'>Sieht so aus als wärst du hier komplett falsch. Lass mich dir helfen zurück zu kommen.</Text>
            <Stack direction='row' spacing={4}>
                <Button variant='outline' colorScheme='primary' _hover={{ bg: 'primary.500', color: 'white' }} borderRadius={0} onClick={() => history.navigate && history.navigate(-3)}>Zurück</Button>
                <Link to='/'>
                    <Button variant='outline' colorScheme='primary' _hover={{ bg: 'primary.500', color: 'white' }} borderRadius={0}>Startseite</Button>
                </Link>
            </Stack>
        </Stack>
    </Container>
);

export default Page404;
