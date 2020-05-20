import { getManager, getConnection } from "typeorm";
import User from '../model/user.model';

export default class UserDao {
    constructor() {

    }

    public async createUser(user: User): Promise<User> {
        const newUser = getManager().create(User, user);
        await getManager().save(newUser);
        return newUser;
    }

    public async getUser(codUser: number): Promise<User | undefined> {
        const userRepo = getConnection().getRepository(User);
        const user = await userRepo.findOne(codUser);
        return user;
    }

    public async removeUser(userToRemove: User): Promise<User | undefined> {
        const userRepo = getConnection().getRepository(User);
        return await userRepo.remove(userToRemove);
    }

    public async updateUser(userToUpdate: User): Promise<User | undefined> {
        const userRepo = getConnection().getRepository(User);
        return await userRepo.save(userToUpdate);
    }
}