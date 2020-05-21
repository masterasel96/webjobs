import User from '../model/user.model';
import UserDao from '../dao/user.dao';
import { isEmpty } from 'lodash';
import md5 from 'md5';

export default class UserService {

    constructor() {}

    public static async getUser(codUser: number = 0): Promise<User | User[] | undefined> {
        const user = await UserDao.getUser(codUser);
        if (isEmpty(user)){
            throw new Error(`Not data from selected user`);
        }
        return user;
    }

    public static async createUser(user: User): Promise<User> {
        if(!await UserDao.checkRegisterUser(user.email, user.dni)){
            throw new Error(`This email or nif is alredy register...`);
        }
        user.password = md5(user.password);
        return await UserDao.createUser(user);
    }
}