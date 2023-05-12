import { InfoIcon } from '@chakra-ui/icons';
import { Button, Center, Stack, Text, Tooltip } from '@chakra-ui/react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { useAppDispatch } from 'app/hooks';
import { AlertMessage } from 'components/controls';
import { alertActions } from 'features/alert/alert.slice';
import { useDeleteScheduleMutation } from 'features/timebooking';
import { Schedule } from 'features/timebooking/types';
import { useTable } from 'functions';
import { getErrorMessage } from 'helpers';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { Link, useOutletContext } from 'react-router-dom';

type OutletProps = {
    data: { schedules?: Schedule[] },
    isLoading: { schedulesIsLoading: boolean },
    error: { schedulesError?: FetchBaseQueryError | SerializedError },
}

const AdminSchedules: React.FC = () => {
    const { data: { schedules }, isLoading: { schedulesIsLoading }, error: { schedulesError } } = useOutletContext<OutletProps>();

    const tableData = useMemo<Schedule[]>(() => schedules!, [schedules]);

    if (schedulesIsLoading) {
        return null;
    }

    if (schedulesError) {
        const { title, description } = getErrorMessage(schedulesError);
        return <AlertMessage status={'error'} title={title || 'Error'}>{description}</AlertMessage>
    }

    return <FormattedTable data={tableData} />
}

type FormattedTableProps = {
    data: Schedule[];
}

const FormattedTable: React.FC<FormattedTableProps> = ({ data }) => {
    const dispatch = useAppDispatch();
    const [deleteSchedule, { isLoading: isDeleting }] = useDeleteScheduleMutation();

    const onDelete = useCallback(async (id: string) => {
        try {
            await deleteSchedule(id).unwrap();
            dispatch(alertActions.success('Ort erfolgreich gelöscht'));
        } catch (err) {
            const { title, description } = getErrorMessage(err);
            if (title) {
                dispatch(alertActions.error({ title, description }));
            } else {
                dispatch(alertActions.error(description))
            }
        }
    }, [deleteSchedule, dispatch]);

    const columnHelper = createColumnHelper<Schedule>();

    const columns = useMemo<ColumnDef<Schedule, any>[]>(() => [
        columnHelper.accessor('isTransferred', {
            header: '',
            enableColumnFilter: false,
            enableSorting: false,
            cell: info => {
                const transferred = Boolean(JSON.parse(info.getValue()));
                console.log({ transferred })
                return (
                    <Center>
                        {transferred
                            ? <MdCheckBox fontSize={'1.5rem'} />
                            : <MdCheckBoxOutlineBlank fontSize={'1.5rem'} />
                        }
                    </Center>
                )
            },
        }),
        columnHelper.accessor(row => `${row.user.lastName}, ${row.user.firstName}`, {
            id: 'user',
            header: 'Benutzer'
        }),
        columnHelper.accessor('location.title', { header: 'Ort' }),
        columnHelper.accessor('task.title', { header: 'Tätigkeit' }),
        columnHelper.accessor('remark', {
            header: () => <Center>Bemerkung</Center>,
            cell: info =>
                info.getValue() && <Center><Tooltip label={info.getValue()}>
                    <InfoIcon fontSize='1.25rem' color='primary.500' />
                </Tooltip></Center>,
            enableColumnFilter: false,
            enableSorting: false
        }),
        columnHelper.accessor('timeFrom', {
            header: 'Datum',
            cell: info => new Date(info.getValue()).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }),
            enableColumnFilter: false
        }),
        columnHelper.accessor(row => {
            const tStart = moment(row.timeFrom).format('HH:mm');
            const tEnd = moment(row.timeTo).format('HH:mm');
            return `${tStart} - ${tEnd} Uhr`
        }, {
            id: 'time',
            header: 'Zeit',
            enableColumnFilter: false,
            enableSorting: false
        }),
        columnHelper.accessor(row => {
            const tStart = moment(row.timeFrom);
            const tEnd = moment(row.timeTo);
            let diff = tEnd.diff(tStart);
            let duration = moment.utc(diff);
            let hasHours = duration.hours() > 0;
            return hasHours ? duration.format('H:mm') + ' Std.' : duration.format('m') + ' Min.'
        }, {
            id: 'duration',
            header: () => <Text textAlign='right'>Dauer</Text>,
            cell: info => <Text textAlign='right'>{info.getValue()}</Text>,
            enableColumnFilter: false,
            enableSorting: false
        }),
        columnHelper.accessor('id', {
            header: '',
            cell: info => {
                const id = info.getValue();
                return (
                    <Center>
                        <Link to={`edit/${id}`}><Button size='sm'>Bearbeiten</Button></Link>
                        <Button size='sm' ml={4} colorScheme={'danger'} onClick={() => onDelete(id)} isDisabled={isDeleting}>Löschen</Button>
                    </Center>
                )
            },
            enableColumnFilter: false
        }),
    ], [columnHelper, isDeleting, onDelete]);

    const {
        TblBody, TblContainer, TblFilter, TblHead, TblPagination,
    } = useTable(data, columns);

    return (
        <Stack direction='column' maxW='container.2xl' spacing={4} mt={4}>
            <TblFilter />
            <TblContainer>
                <TblHead />
                <TblBody />
            </TblContainer>
            <TblPagination />
        </Stack>
    )
}

export default AdminSchedules;
