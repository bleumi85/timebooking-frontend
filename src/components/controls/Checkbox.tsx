import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { CheckboxProps, Flex, FormControl, FormErrorMessage, FormLabel, IconButton } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import React from 'react';

interface CustomCheckboxProps extends Partial<CheckboxProps> {
    name: string;
    label?: string;
    checked: boolean;
    align?: 'left' | 'center' | 'right';
    error?: string | boolean;
}

export const Checkbox: React.FC<CustomCheckboxProps> = (props) => {
    const { align = 'left', checked, error, label, name } = props;
    const myFlex =
        align === 'left' ? 'flex-start'
            : align === 'right' ? 'flex-end'
                : align;

    const { setFieldValue } = useFormikContext();

    return (
        <FormControl isInvalid={!!error}>
            {label && <FormLabel htmlFor={name} textAlign={align}>{label}</FormLabel>}
            <Flex justifyContent={myFlex}>
                {checked ? (
                    <IconButton
                        aria-label='checked'
                        colorScheme='green'
                        icon={<CheckIcon />}
                        onClick={() => setFieldValue(name, false)}
                    />
                ) : (
                    <IconButton
                        aria-label='unchecked'
                        colorScheme='red'
                        icon={<CloseIcon />}
                        onClick={() => setFieldValue(name, true)}
                    />
                )}
            </Flex>
            {error && (
                <FormErrorMessage>{error}</FormErrorMessage>
            )}
        </FormControl>
    )
}