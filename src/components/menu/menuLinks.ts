export interface IMenuItem {
    label: string;
    target: string;
}

export const userLinks: IMenuItem[] = [
    { label: 'Orte', target: 'locations' },
    { label: 'Tätigkeiten', target: 'tasks' },
    { label: 'Buchungen', target: 'schedules' },
];

export const adminLinks: IMenuItem[] = [
    { label: 'Admin', target: 'admin' }
];
