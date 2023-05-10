import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle } from '@chakra-ui/react';
import React from 'react';

interface AlertMessageProps extends AlertProps {
    title: string;
    children: string | React.ReactElement;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({ title, children, ...rest }) => (
    <Alert
        variant={'top-accent'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        {...rest}
    >
        <AlertIcon boxSize={10} mr={0} />
        <AlertTitle mt={4} mb={1} fontSize={'lg'}>
            {title}
        </AlertTitle>
        <AlertDescription maxWidth={'sm'}>
            {children}
        </AlertDescription>
    </Alert>
);
