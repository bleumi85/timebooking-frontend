import { Button, Center, IconButton, Stack } from "@chakra-ui/react";
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { useAppDispatch } from "app/hooks";
import { AlertMessage } from "components/controls";
import { alertActions } from 'features/alert/alert.slice';
import { useDeleteTaskMutation } from "features/timebooking";
import { Task } from "features/timebooking/types";
import { useTable } from "functions";
import { getErrorMessage } from "helpers";
import React, { useCallback, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

type OutletProps = {
    data: { tasks?: Task[] },
    isLoading: { tasksIsLoading: boolean },
    error: { tasksError?: FetchBaseQueryError | SerializedError },
}

const AdminTasks: React.FC = () => {
    const { data: { tasks }, isLoading: { tasksIsLoading }, error: { tasksError } } = useOutletContext<OutletProps>();

    const tableData = useMemo<Task[]>(() => tasks!, [tasks]);

    if (tasksIsLoading) {
        return null;
    }

    if (tasksError) {
        const { title, description } = getErrorMessage(tasksError);
        return <AlertMessage status={'error'} title={title || 'Error'}>{description}</AlertMessage>
    }

    return <FormattedTable data={tableData} />
}

type FormattedTableProps = {
    data: Task[];
}

const FormattedTable: React.FC<FormattedTableProps> = ({ data }) => {
    const dispatch = useAppDispatch();
    const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

    const onDelete = useCallback(async (id: string) => {
        try {
            await deleteTask(id).unwrap();
            dispatch(alertActions.success('Tätigkeit erfolgreich gelöscht'))
        } catch (err) {
            const { title, description } = getErrorMessage(err);
            if (title) {
                dispatch(alertActions.error({ title, description }));
            } else {
                dispatch(alertActions.error(description))
            }
        }
    }, [deleteTask, dispatch]);

    const columnHelper = createColumnHelper<Task>();

    const columns = useMemo<ColumnDef<Task, any>[]>(() => [
        columnHelper.accessor(row => row, {
            id: 'icon-color',
            header: () => <Center>Farbe + Icon</Center>,
            cell: info => {
                const { id, icon, color } = info.getValue();
                const iconName = icon as IconName;
                return (
                    <Center>
                        <IconButton
                            aria-label={`icon-color-${id}`}
                            size={'sm'}
                            bg={color}
                            icon={iconName && <FontAwesomeIcon icon={['fas', iconName]} size='lg' color='white' />}
                        />
                    </Center>
                );
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
        columnHelper.accessor(row => row, {
            id: 'actions',
            header: '',
            cell: info => {
                const { id } = info.getValue();
                // TODO
                const disabled = true;
                return (
                    <Center>
                        <Link to={`edit/${id}`}><Button size={'sm'}>Bearbeiten</Button></Link>
                        <Button size={'sm'} ml={4} colorScheme={'danger'} onClick={() => onDelete(id)} isDisabled={isDeleting || disabled}>Löschen</Button>
                    </Center>
                )
            }
        }),
    ], [columnHelper, isDeleting, onDelete]);

    const {
        TblBody, TblContainer, TblFilter, TblHead, TblPagination,
    } = useTable(data, columns, false);

    return (
        <Stack direction='column' maxW='container.2xl' spacing={4} mt={4}>
            <TblFilter />
            <TblContainer>
                <colgroup>
                    <col width='15%' />
                    <col width='25%' />
                    <col width='25%' />
                    <col width='35%' />
                </colgroup>
                <TblHead />
                <TblBody />
            </TblContainer>
            <TblPagination />
        </Stack>
    )
}

export default AdminTasks;
