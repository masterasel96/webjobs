import { SexType, ContractStatus } from "./db.interface";

export interface IProfesionalExpUpdate {
    category?: string;
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
}

export interface IUserUpdate {
    userName?: string;
    lastName?: string;
    email?: string;
    dni?: string;
    telf?: string;
    age?: number;
    sex?: SexType;
    password?: string;
    postalCode?: number;
    city?: string;
    region?: string;
    address?: string;
    bio?: string;
    offer?: string;
    photo?: string;
    lastLogin?: string;
    token?: string;
}

export interface IContractUpdate {
    startDate?: string;
    endDate?: string;
    status?: ContractStatus;
    contractorAssessment?: string;
    workerAssessment?: string;
    contractorPunctuation?: number;
    workerPunctuation?: number;
}