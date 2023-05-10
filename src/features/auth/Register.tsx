import { Avatar, Box, Button, Flex, Grid, GridItem, Heading, Spacer, Stack, Text } from '@chakra-ui/react';
import { useAppDispatch } from 'app/hooks';
import { Checkbox, Input } from 'components/controls';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { RegisterData } from './types';
import { authActions } from './authSlice';

export const Register: React.FC = () => {
    const dispatch = useAppDispatch();

    // initial values
    const initialValues: RegisterData = {
        userName: 'johnny.walker', firstName: 'Johnny', lastName: 'Walker', email: 'johnny@drinks.com', password: 'Abcd1234', confirmPassword: 'Abcd1234', acceptTerms: true,
    }

    // form validation rules
    const validationSchema = Yup.object().shape({
        password: Yup.string().required('Passwort!').min(6),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passswörter müssen übereinstimmen'),
        acceptTerms: Yup.boolean().oneOf([true], 'Accept terms!')
    });

    // submit
    const onSubmit = async (values: RegisterData, { resetForm }: FormikHelpers<RegisterData>) => {
        await dispatch(authActions.register(values));
        resetForm();
    }

    return (
        <>
            <Avatar bg={'primary.500'} />
            <Heading color={'primary.400'}>Registrieren</Heading>
            <Spacer />
            <Box w={'100%'}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({ errors, handleChange, isSubmitting, touched, values }: FormikProps<RegisterData>) => (
                        <Form>
                            <Stack
                                direction={'column'}
                                spacing={8}
                                p={'1rem'}
                                boxShadow={'md'}
                                background={'white'}
                                align={'stretch'}
                            >
                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                        <Input
                                            isRequired
                                            label="Vorname"
                                            name="firstName"
                                            placeholder="Johnny"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            w={'100%'}
                                        />
                                    </GridItem>
                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                        <Input
                                            isRequired
                                            name="lastName"
                                            label="Nachname"
                                            placeholder="Walker"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            error={touched.lastName && errors.lastName}
                                        />
                                    </GridItem>
                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                        <Input
                                            isRequired
                                            name="userName"
                                            label="Benutzername"
                                            placeholder="johnny.walker"
                                            value={values.userName}
                                            onChange={handleChange}
                                        />
                                    </GridItem>
                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                        <Checkbox
                                            name="acceptTerms"
                                            label="Einverstanden?"
                                            checked={values.acceptTerms}
                                            error={touched.acceptTerms && errors.acceptTerms}
                                        />
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <Input
                                            isRequired
                                            name="email"
                                            label="Email Adresse"
                                            placeholder="johnny.walker@drinks.com"
                                            value={values.email}
                                            onChange={handleChange}
                                            autoComplete='current-email'
                                        />
                                    </GridItem>
                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                        <Input
                                            password
                                            isRequired
                                            name="password"
                                            label="Passwort"
                                            value={values.password}
                                            onChange={handleChange}
                                            error={touched.password && errors.password}
                                            color={'black'}
                                        />
                                    </GridItem>
                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                        <Input
                                            password
                                            isRequired
                                            name="confirmPassword"
                                            label="Passwort wiederholen"
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            error={touched.confirmPassword && errors.confirmPassword}
                                            color={'black'}
                                        />
                                    </GridItem>
                                </Grid>
                                <Button type={'submit'} isLoading={isSubmitting}>
                                    Registrieren
                                </Button>
                                <Flex justifyContent={'center'}>
                                    <Text mr={1}>Bereits registriert? Dann jetzt</Text>
                                    <Link to="../login">
                                        <Button variant={'link'}>Anmelden!</Button>
                                    </Link>
                                </Flex>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        </>
    )
}
