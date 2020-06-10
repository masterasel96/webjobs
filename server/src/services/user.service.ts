import User from '../model/user.model';
import UserDao from '../dao/user.dao';
import { isEmpty, isArray } from 'lodash';
import md5 from 'md5';
import { IUserUpdateRequest } from '../interface/request.interface';
import { UpdateResult } from 'typeorm';

export default class UserService {

    constructor() {}

    public static async getUser(codUser: number = 0): Promise<User | User[] | undefined> {
        const user = await UserDao.getUser(codUser);
        if (isEmpty(user)){
            throw new Error(`No existen datos para el usuario seleccionado...`);
        }
        return user;
    }

    public static async createUser(user: User): Promise<User> {
        if(!await UserDao.checkRegisterUser(user.email, user.dni)){
            throw new Error(`Este email o NIF ya esta registrado...`);
        }
        user.password = md5(user.password);
        return await UserDao.createUser(user);
    }

    public static async checkLogin(email: string, password: string): Promise<User[] | null> {
        return await UserDao.checkLogin(email, password);
    }

    public static async checkLastLogin(token: string): Promise<boolean> {
        return await UserDao.checkLastLogin(token);
    }

    public static async getUserByCatLoc(catName: string, location: string, noUser?: string): Promise<User[]> {
        const users = await UserDao.getUsersByCatLoc(catName, location, noUser);
        if(users === undefined){
            throw new Error(`Error obteniendo usuarios por categoria y localizacion...`);
        }
        return users;
    }

    public static async updateUser(updateData: IUserUpdateRequest): Promise<User> {
        const oldUser = await UserDao.getUser(updateData.codUser);
        if (oldUser === undefined || isArray(oldUser)) {
            throw new Error(`Este usuario no existe...`);
        }
        const userAttr = User.describe();
        Object.keys(updateData.newValues).forEach(val => {
            if (!userAttr.includes(val)) {
                throw new Error(`Error en valores de modificacion...`);
            }
        });
        if (Object.keys(updateData.newValues).includes('password')) {
            (updateData.newValues as { password: string }).password = md5((updateData.newValues as { password: string }).password);
        }
        const newUser = {
            ...oldUser,
            ...updateData.newValues
        }
        const updateUser = await UserDao.updateUser(newUser as User);
        if (updateUser === undefined) {
            throw new Error(`Error modificando el usuario...`);
        }
        return updateUser;
    }

    public static async getUserByToken(token: string): Promise<User | undefined>{
        return await UserDao.getUserByToken(token);
    }
}