export type AlertState = {
    type: AlertType | null;
    title?: string;
    description: string;
};

export enum AlertType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}
