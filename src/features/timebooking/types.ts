import { MinimalUser } from 'features/auth/types';

interface BaseData {
    id: string;
    title: string;
    color?: string;
    icon?: string;
    showCompleteMonth: boolean;
    user: MinimalUser;
}

export interface Location extends BaseData {
    schedulesCount?: number;
}

export interface Task extends BaseData {}

export interface Schedule {
    id: string;
    timeFrom: Date;
    timeTo: Date;
    remark?: string;
    isTransferred: boolean;
    user: MinimalUser;
    location: Pick<Location, 'id' | 'title'>;
    task: Pick<Task, 'id' | 'title'>;
    hasConflict: boolean;
}
