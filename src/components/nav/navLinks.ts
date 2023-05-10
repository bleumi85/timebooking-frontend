export interface CustomNavLinkProps {
    label: string;
    target: string;
}

export const userLinks: CustomNavLinkProps[] = [
    { label: 'Orte', target: 'locations' },
    { label: 'Tätigkeiten', target: 'tasks' },
    { label: 'Buchungen', target: 'schedules' },
];

export const adminLinks: CustomNavLinkProps[] = [{ label: 'Admin', target: 'admin' }];
