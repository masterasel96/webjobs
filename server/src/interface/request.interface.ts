import { IProfesionalExpUpdate, IUserUpdate, IContractUpdate } from "./update.interface";

export interface IProfExpRequest {
    codUser: number,
    codCategory: number,
    position: string,
    company: string,
    startDate: string,
    endDate: string,
}

export interface INotificationRequest {
    codUser: number,
    codIndirectUser: number;
    message: string;
}

export interface IContractRequest {
    codContractor: number;
    codWorker: number;
    msg?: string;
}

export interface IProfExpUpdateRequest {
    codProfExp: number,
    newValues: IProfesionalExpUpdate
}

export interface IUserUpdateRequest {
    codUser: number,
    newValues: IUserUpdate
}

export interface IContractUpdateRequest {
    codContract: number;
    newValues: IContractUpdate;
}

