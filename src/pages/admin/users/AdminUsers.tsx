import { CheckIcon } from "@chakra-ui/icons";
import { Button, Center, Stack, useColorModeValue } from "@chakra-ui/react";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { useAppDispatch } from "app/hooks";
import { AlertMessage } from "components/controls";
import { alertActions } from "features/alert/alert.slice";
import { User } from "features/auth/types";
import { useDeleteUserMutation } from "features/timebooking";
import { useTable } from "functions";
import { getErrorMessage } from "helpers";
import React, { useCallback, useMemo } from 'react';
import { Link, useOutletContext } from "react-router-dom";

type OutletProps = {
    data: { users?: User[] },
    isLoading: { usersIsLoading: boolean },
    error: { usersError?: FetchBaseQueryError | SerializedError },
}

const AdminUsers: React.FC = () => {
    const { data: { users }, isLoading: { usersIsLoading }, error: { usersError } } = useOutletContext<OutletProps>();

    const tableData = useMemo<User[]>(() => users!, [users]);

    if (usersIsLoading) {
        return null;
    }

    if (usersError) {
        return <AlertMessage status={'error'} title='Error'>Schwerer Fehler</AlertMessage>
    }

    return <FormattedTable data={tableData} />
}

type FormattedTableProps = {
    data: User[];
}

const FormattedTable: React.FC<FormattedTableProps> = ({ data }) => {
    const dispatch = useAppDispatch();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const checkColor = useColorModeValue('green.500', 'green.200');

    const onDelete = useCallback(async (id: string) => {
        try {
            await deleteUser(id).unwrap();
            dispatch(alertActions.success('User erfolgreich gelöscht'));
        } catch (err) {
            const { title, description } = getErrorMessage(err);
            if (title) {
                dispatch(alertActions.error({ title, description }));
            } else {
                dispatch(alertActions.error(description))
            }
        }
    }, [deleteUser, dispatch]);

    const columnHelper = createColumnHelper<User>();

    const columns = useMemo<ColumnDef<User, any>[]>(() => [
        columnHelper.accessor('isVerified', {
            header: '',
            cell: info => {
                const isVerified = info.getValue() as boolean;
                if (isVerified) return <Center><CheckIcon color={checkColor} /></Center>;
                return null;
            },
        }),
        columnHelper.accessor(row => `${row.lastName}, ${row.firstName}`, { id: 'fullName', header: 'Name' }),
        columnHelper.accessor('email', { header: 'E-Mail' }),
        columnHelper.accessor('role', { header: 'Rolle' }),
        columnHelper.accessor(row => row, {
            id: 'actions',
            header: '',
            cell: info => {
                const { id } = info.getValue();
                return (
                    <Center>
                        <Link to={`edit/${id}`}><Button size={'sm'}>Bearbeiten</Button></Link>
                        <Button size={'sm'} ml={4} colorScheme={'danger'} onClick={() => onDelete(id)} disabled={isDeleting}>Löschen</Button>
                    </Center>
                )
            }
        })
    ], [checkColor, columnHelper, isDeleting, onDelete]);

    const {
        TblBody, TblContainer, TblFilter, TblHead, TblPagination,
    } = useTable<User>(data, columns, false);

    return (
        <Stack direction='column' maxW='container.2xl' spacing={4} mt={4}>
            <TblFilter />
            <TblContainer colorScheme="gray">
                <TblHead />
                <TblBody />
            </TblContainer>
            <TblPagination />
        </Stack>
    )
}

export default AdminUsers;
