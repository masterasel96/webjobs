export interface IResponse {
    code: number;
    data: any;
    status: number;
}

export enum NotifysTypes {
    PENDING_WORK = 'PENDING_WORK',
    ACCEPT_WORK = 'ACCEPT_WORK',
    FINISH_WORK = 'FINISH_WORK',
    CANCEL_WORK = 'CANCEL_WORK'
}
