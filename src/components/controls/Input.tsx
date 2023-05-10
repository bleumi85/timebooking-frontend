import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    InputProps,
    FormControl,
    FormLabel,
    Input as ChakraInput,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    FormErrorMessage,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface CustomInputProps extends InputProps {
    name: string;
    label?: string;
    value: string;
    error?: string | boolean;
    isRequired?: boolean;
    password?: boolean;
    icon?: React.ReactElement;
}

export const Input: React.FC<CustomInputProps> = (props) => {
    const {
        color,
        error,
        icon,
        isRequired = false,
        onChange,
        label,
        password = false,
        name,
        value,
        ...rest
    } = props;

    const [showPW, setShowPW] = useState(false);
    const handleShow = () => setShowPW(!showPW);

    return (
        <FormControl isInvalid={!!error} isRequired={isRequired}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <InputGroup>
                {icon && <InputLeftElement pointerEvents={'none'} children={icon} />}
                <ChakraInput
                    id={name}
                    name={name}
                    value={value}
                    color={color}
                    type={password && !showPW ? 'password' : 'text'}
                    onChange={onChange}
                    autoComplete={password ? 'current-password' : undefined}
                    {...rest}
                />
                {password && (
                    <InputRightElement>
                        <IconButton
                            aria-label='Show Password'
                            bg={'transparent'}
                            onClick={handleShow}
                            _hover={{ bg: 'transparent' }}
                        >
                            {showPW ? <ViewIcon color={color} /> : <ViewOffIcon color={color} />}
                        </IconButton>
                    </InputRightElement>
                )}
            </InputGroup>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};
