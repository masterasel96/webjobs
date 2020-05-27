export interface IProfExpRequest {
    codUser: number,
    codCategory: number,
    position: string,
    company: string,
    startDate: string,
    endDate: string,
}

export interface IProfExpUpdateRequest {
    codProfExp: number,
    newValues: Object
}

export interface IUserUpdateRequest {
    codUser: number,
    newValues: Object
}