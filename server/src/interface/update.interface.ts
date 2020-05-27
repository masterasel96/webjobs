import { SexType } from "./db.interface";

export interface IProfesionalExpUpdate {
    category?: string;
    position?: string;
    company?: string;
    startDate?: Date;
    endDate?: Date;
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
    lastLogin?: Date;
}