import { getManager, getConnection } from "typeorm";
import User from '../model/user.model';

export default class UserDao {
    constructor() {

    }

    public static async createUser(user: User): Promise<User> {
        const newUser = getManager().create(User, user);
        return await getManager().save(newUser);  
    }

    public static async getUser(codUser: number = 0): Promise<User | User[] | undefined> {
        const userRepo = getConnection().getRepository(User);
        const user = codUser === 0 ? await userRepo.find() : await userRepo.findOne(codUser);
        return user;
    }

    public static async removeUser(userToRemove: User): Promise<User | undefined> {
        const userRepo = getConnection().getRepository(User);
        return await userRepo.remove(userToRemove);
    }

    public static async updateUser(userToUpdate: User): Promise<User | undefined> {
        const userRepo = getConnection().getRepository(User);
        return await userRepo.save(userToUpdate);
    }

    public static async checkRegisterUser(email: string, nif: string): Promise<boolean> {
        const userCount = await getConnection().getRepository(User)
            .createQueryBuilder('user')
            .where("user.email = :email OR user.dni = :nif", { email, nif })
            .getCount();
        return userCount > 0 ? false : true;
    }
}