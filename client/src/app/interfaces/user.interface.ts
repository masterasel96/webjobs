export interface ICheckLoginRequest {
    email: string;
    password: string;
}

export enum SexType {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export interface IRegisterRequest {
    userName: string;
    lastName: string;
    email: string;
    dni: string;
    telf: number;
    age: number;
    sex: SexType;
    password: string;
    postalCode: number;
    city: string;
    region: string;
    address: string;
    offer?: boolean;
}

export interface ICatLocRequest {
    category: string | null;
    location: string;
}
