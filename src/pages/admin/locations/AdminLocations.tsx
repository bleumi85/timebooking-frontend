import { Box, Button, Center, Stack } from '@chakra-ui/react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { useAppDispatch } from 'app/hooks';
import { AlertMessage } from 'components/controls';
import { alertActions } from 'features/alert/alert.slice';
import { useDeleteLocationMutation } from 'features/timebooking';
import { Location } from 'features/timebooking/types';
import { useTable } from 'functions';
import { getErrorMessage } from 'helpers';
import React, { useCallback, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

type OutletProps = {
    data: { locations?: Location[] },
    isLoading: { locationsIsLoading: boolean },
    error: { locationsError?: FetchBaseQueryError | SerializedError },
}

const AdminLocations: React.FC = () => {
    const { data: { locations }, isLoading: { locationsIsLoading }, error: { locationsError } } = useOutletContext<OutletProps>();

    const tableData = useMemo<Location[]>(() => locations!, [locations]);

    if (locationsIsLoading) {
        return null;
    }

    if (locationsError) {
        const { title, description } = getErrorMessage(locationsError);
        return <AlertMessage status={'error'} title={title || 'Error'}>{description}</AlertMessage>
    }

    return <FormattedTable data={tableData} />
}

type FormattedTableProps = {
    data: Location[];
}

const FormattedTable: React.FC<FormattedTableProps> = ({ data }) => {
    const dispatch = useAppDispatch();
    const [deleteLocation, { isLoading: isDeleting }] = useDeleteLocationMutation();

    const onDelete = useCallback(async (id: string) => {
        try {
            await deleteLocation(id).unwrap();
            dispatch(alertActions.success('Ort erfolgreich gelöscht'));
        } catch (err) {
            const { title, description } = getErrorMessage(err);
            if (title) {
                dispatch(alertActions.error({ title, description }));
            } else {
                dispatch(alertActions.error(description))
            }
        }
    }, [deleteLocation, dispatch]);

    const columnHelper = createColumnHelper<Location>();

    const columns = useMemo<ColumnDef<Location, any>[]>(() => [
        columnHelper.accessor('color', {
            header: () => <Center>Farbe</Center>,
            cell: info => {
                return info.getValue() && <Center><Box w={6} h={6} borderRadius={'md'} bg={info.getValue()} /></Center>
            }
        }),
        columnHelper.accessor('title', { header: 'Bezeichnung' }),
        columnHelper.accessor(row => row, {
            id: 'user',
            header: 'Gehört zu',
            cell: info => {
                const { id, user: { firstName, lastName } } = info.getValue();
                return (
                    <Link to={`/admin/users/${id}`}>{lastName}, {firstName}</Link>
                )
            }
        }),
        columnHelper.accessor('icon', { header: 'Icon' }),
        columnHelper.accessor(row => row, {
            id: 'actions',
            header: '',
            cell: info => {
                const { id } = info.getValue();
                // TODO
                const disabled = false;
                return (
                    <Center>
                        <Link to={`edit/${id}`}><Button size={'sm'}>Bearbeiten</Button></Link>
                        <Button size={'sm'} ml={4} colorScheme={'danger'} onClick={() => onDelete(id)} isDisabled={isDeleting || disabled}>Löschen</Button>
                    </Center>
                )
            }
        })
    ], [columnHelper, isDeleting, onDelete]);

    const {
        TblBody, TblContainer, TblFilter, TblHead, TblPagination,
    } = useTable(data, columns, false);

    return (
        <Stack direction='column' maxW='container.2xl' spacing={4} mt={4}>
            <TblFilter />
            <TblContainer>
                <colgroup>
                    <col width='10%' />
                    <col width='25%' />
                    <col width='25%' />
                    <col width='10%' />
                    <col width='30%' />
                </colgroup>
                <TblHead />
                <TblBody />
            </TblContainer>
            <TblPagination />
        </Stack>
    )
}

export default AdminLocations;
