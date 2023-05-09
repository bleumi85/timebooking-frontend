import { useToast } from '@chakra-ui/react';
import { useAppSelector } from 'app/hooks';
import React, { useEffect } from 'react';

const Alert: React.FC = () => {
    const { type, title, description } = useAppSelector(state => state.alert);
    const toast = useToast();
    const id = 'alert-id';

    useEffect(() => {
        if (!toast.isActive(id)) {
            if (type !== null) {
                toast({
                    id,
                    title,
                    description,
                    status: `${type}`,
                    duration: 4000,
                    isClosable: true
                });
            }
        }
    })

    return null;
}

export default Alert;
