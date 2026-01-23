export enum AppAlertType {
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
    SUCCESS = 'success'
}

export interface AppAlert {
    type: AppAlertType;
    message: string;
}