import { AreaType } from 'features/filter/filterTypes';
import { IconType } from 'react-icons';
import { MdFace, MdHouse, MdSchedule, MdTask } from 'react-icons/md';

export interface AdminLinkProps {
    to: AreaType;
    label: string;
    icon: IconType;
}

export const adminLinks: AdminLinkProps[] = [
    { label: 'User', to: AreaType.USERS, icon: MdFace },
    { label: 'Buchungen', to: AreaType.SCHEDULES, icon: MdSchedule },
    { label: 'Orte', to: AreaType.LOCATIONS, icon: MdHouse },
    { label: 'Tätigkeiten', to: AreaType.TASKS, icon: MdTask },
];