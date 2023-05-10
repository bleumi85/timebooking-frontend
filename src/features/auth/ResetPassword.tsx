import {
    Avatar,
    Box,
    Button,
    Heading,
    Spacer,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { AlertMessage, Input } from 'components/controls';
import { Form, Formik, FormikProps } from 'formik';
import { history } from 'helpers';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import authService from './authService';
import { ResetPasswordData } from './types';
import { useAppDispatch } from 'app/hooks';
import { alertActions } from 'features/alert/alert.slice';

const TokenStatus = {
    Validating: 'Validating',
    Valid: 'Valid',
    Invalid: 'Invalid',
};

export const ResetPassword: React.FC = () => {
    const [token, setToken] = useState<string>('');
    const [tokenStatus, setTokenStatus] = useState<string>(
        TokenStatus.Validating,
    );

    const dispatch = useAppDispatch();

    const bg = useColorModeValue('white', 'black');
    const color = useColorModeValue('black', 'white');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const url_token = params.get('token');

        if (history.location && history.navigate) {
            console.log(`navigate to ${history.location.pathname}`);
        }

        if (url_token) {
            authService
                .validateResetToken(url_token)
                .then(() => {
                    setToken(url_token);
                    setTokenStatus(TokenStatus.Valid);
                })
                .catch(() => {
                    setTokenStatus(TokenStatus.Invalid);
                });
        }
    }, []);

    const getForm = (): JSX.Element => {
        // initial values
        const initialValues: ResetPasswordData = {
            password: 'Abcd1234',
            confirmPassword: 'Abcd1234',
        };

        // form validation rules
        const validationSchema = Yup.object().shape({
            password: Yup.string().min(6),
            confirmPassword: Yup.string().oneOf([Yup.ref('password')]),
        });

        const onSubmit = (values: ResetPasswordData) => {
            authService
                .resetPassword(values, token)
                .then((res) => {
                    dispatch(alertActions.success(res.data.message));
                    if (history.navigate) {
                        history.navigate('user/login');
                    }
                })
                .catch(() => {
                    dispatch(
                        alertActions.error(
                            'Da ist etwas gehörig schief gelaufen',
                        ),
                    );
                });
        };

        return (
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
                    }: FormikProps<ResetPasswordData>) => (
                        <Form>
                            <Stack
                                spacing={4}
                                p={'1rem'}
                                boxShadow={'md'}
                                background={bg}
                            >
                                <Input
                                    password
                                    isRequired
                                    name="password"
                                    label="Passwort"
                                    color={color}
                                    value={values.password}
                                    onChange={handleChange}
                                    error={touched.password && errors.password}
                                />
                                <Input
                                    password
                                    isRequired
                                    name="confirmPassword"
                                    label="Passwort wiederholen"
                                    color={color}
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    error={
                                        touched.confirmPassword &&
                                        errors.confirmPassword
                                    }
                                />
                                <Button
                                    type={'submit'}
                                    isLoading={isSubmitting}
                                >
                                    Ok
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        );
    };

    const getBody = (): JSX.Element => {
        switch (tokenStatus) {
            case TokenStatus.Valid:
                return getForm();
            case TokenStatus.Invalid:
                return (
                    <AlertMessage
                        status="error"
                        title="Validierung fehlgeschlagen"
                    >
                        <Box>
                            <Text>
                                Wenn die Anfrage abgelaufen ist, klicke hier um
                                das Passwort erneut zurückzusetzen
                            </Text>
                            <Link to="../forgot-password">
                                <Button colorScheme={'red'} mt={2}>
                                    Klick
                                </Button>
                            </Link>
                        </Box>
                    </AlertMessage>
                );
            case TokenStatus.Validating:
                return (
                    <AlertMessage status="loading" title="Warten">
                        Anfrage wird validiert
                    </AlertMessage>
                );
            default:
                return (
                    <Text color={'red.500'}>Da ist etwas schief gelaufen</Text>
                );
        }
    };

    return (
        <>
            <Avatar bg={'primary.500'} />
            <Heading color={'primary.400'}>
                {token === '' ? 'Passwort zurücksetzen' : 'Neues Passwort'}
            </Heading>
            <Spacer />
            {getBody()}
        </>
    );
};
