import { Avatar, Box, Button, Heading, Spacer, Stack } from '@chakra-ui/react';
import { useAppDispatch } from 'app/hooks';
import { Input } from 'components/controls';
import { Form, Formik, FormikProps } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { LoginData } from './types';
import { authActions } from './authSlice';

export const Login: React.FC = () => {
    const dispatch = useAppDispatch();

    // initial values
    const initialValues: LoginData = { email: '', password: '' };

    // form validation rules
    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required('Email ist Pflichtfeld'),
        password: Yup.string().required('Passwort ist Pflichtfeld'),
    });

    const onSubmit = (values: LoginData) => {
        return dispatch(authActions.login(values));
    };

    return (
        <React.Fragment>
            <Avatar bg={'primary.500'} />
            <Heading color={'primary.400'}>Anmelden</Heading>
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
                    }: FormikProps<LoginData>) => (
                        <Form>
                            <Stack
                                spacing={4}
                                p={'1rem'}
                                boxShadow={'md'}
                                bg={'white'}
                                align={'stretch'}
                            >
                                <Input
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    error={touched.email && errors.email}
                                    autoComplete="current-email"
                                    w={'100%'}
                                />
                                <Input
                                    password
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    error={touched.password && errors.password}
                                    color={'gray.700'}
                                />
                                <Button
                                    type={'submit'}
                                    variant={'solid'}
                                    isLoading={isSubmitting}
                                >
                                    Anmelden
                                </Button>
                                <Stack
                                    direction={'row'}
                                    justifyContent={'space-between'}
                                >
                                    <Link to="../register">
                                        <Button variant={'link'}>
                                            Registrieren
                                        </Button>
                                    </Link>
                                    <Link to="../forgot-password">
                                        <Button variant={'link'}>
                                            Passwort vergessen?
                                        </Button>
                                    </Link>
                                </Stack>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        </React.Fragment>
    );
};
