import { Avatar, Box, Button, Heading, Spacer, Stack } from '@chakra-ui/react';
import { useAppDispatch } from 'app/hooks';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { ForgotPasswordData } from './types';
import { Input } from 'components/controls';
import { authActions } from './authSlice';

export const ForgotPassword: React.FC = () => {
    const dispatch = useAppDispatch();

    // initial values
    const initialValues: ForgotPasswordData = { email: '' };

    // form validation rules
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('E-Mail muss valide sein'),
    });

    const onSubmit = async (
        values: ForgotPasswordData,
        { resetForm }: FormikHelpers<ForgotPasswordData>,
    ) => {
        await dispatch(authActions.forgotPassword(values));
        resetForm();
    };

    return (
        <>
            <Avatar bg={'primary.500'} />
            <Heading color={'primary.400'}>Passwort vergessen?</Heading>
            <Spacer />
            <Box w={'100%'}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({
                        errors,
                        handleChange,
                        isSubmitting,
                        touched,
                        values,
                    }: FormikProps<ForgotPasswordData>) => (
                        <Form>
                            <Stack
                                spacing={4}
                                p={'1rem'}
                                boxShadow={'md'}
                                bg={'white'}
                                align={'stretch'}
                            >
                                <Input
                                    isRequired
                                    name='email'
                                    label='E-Mail'
                                    value={values.email}
                                    onChange={handleChange}
                                    error={touched.email && errors.email}
                                />
                                <Button type='submit' isLoading={isSubmitting}>
                                    Zurücksetzen
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        </>
    );
};
