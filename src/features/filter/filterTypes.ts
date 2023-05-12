export type FilterState = {
    area: AreaType;
}

export enum AreaType {
    USERS = 'users',
    SCHEDULES = 'schedules',
    LOCATIONS = 'locations',
    TASKS = 'tasks',
}
