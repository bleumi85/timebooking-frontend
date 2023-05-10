import { Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Box, Button, Heading, Spacer, Text } from '@chakra-ui/react';
import { useAppDispatch } from 'app/hooks';
import { history } from 'helpers';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authService from './authService';
import { alertActions } from 'features/alert/alert.slice';

const EmailStatus = {
    Verifying: 'Verifying',
    Failed: 'Failed',
}

export const VerifyEmail: React.FC = () => {
    const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (history.location && history.navigate) {
            history.navigate(history.location.pathname)
        }

        if (token) {
            authService.verifyEmail(token)
                .then((res) => {
                    dispatch(alertActions.success(res.data.message));
                    if (history.navigate) {
                        history.navigate('user/login')
                    }
                })
                .catch(() => {
                    setEmailStatus(EmailStatus.Failed);
                });
        }
    }, [dispatch]);

    const getBody = (): JSX.Element => {
        switch (emailStatus) {
            case EmailStatus.Verifying:
                return <TokenMessage status="info" title="Warten">
                    Anfrage wird validiert
                </TokenMessage>
            case EmailStatus.Failed:
                return <TokenMessage status="error" title="Validierung fehlgeschlagen">
                    <Box>
                        <Text>Wenn die Anfrage abgelaufen ist, klicke hier um das Passwort erneut zurückzusetzen</Text>
                        <Link to="../forgot-password">
                            <Button colorScheme={'red'} mt={2}>Klick</Button>
                        </Link>
                    </Box>
                </TokenMessage>
            default:
                return <Text color={'red.500'}>Da ist etwas schief gelaufen!</Text>
        }
    }

    return (
        <>
            <Avatar bg={'primary.500'} />
            <Heading color={'primary.400'}>User Validierung</Heading>
            <Spacer />
            {getBody()}
        </>
    )
}

type TokenMessageProps = {
    status: 'error' | 'info';
    title: string;
    children: string | React.ReactElement;
}

const TokenMessage: React.FC<TokenMessageProps> = ({ status, title, children }): JSX.Element => (
    <Alert
        status={status}
        variant={'top-accent'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        height={200}
    >
        <AlertIcon boxSize={10} mr={0} />
        <AlertTitle mt={4} mb={1} fontSize={'lg'}>
            {title}
        </AlertTitle>
        <AlertDescription maxWidth={'sm'}>
            {children}
        </AlertDescription>
    </Alert>
)
