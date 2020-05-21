import { getManager, getConnection } from "typeorm";
import User from '../model/user.model';
import md5 from "md5";
import { isNull } from "lodash";

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

    public static async checkLogin(email: string, pass: string): Promise<boolean> {
        const userCount = await getConnection().getRepository(User)
            .createQueryBuilder('user')
            .where("user.email = :email AND user.password = :pass", { email, pass: md5(pass) })
            .getCount();
        if(userCount > 0){
            await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({ lastLogin: new Date() })
                .where("email = :email", { email })
                .execute();
            return true;
        }
        return false;
    }

    public static async checkLastLogin(codUser: number): Promise<boolean> {
        const user = await getConnection().getRepository(User).findOne(codUser);
        if(user === undefined){
            throw new Error(`This user doesn't exists...`);
        }
        let newTime: Date | undefined = new Date();
        if (process.env.LOGIN_TIME !== undefined 
                && !isNull(user.lastLogin) && ((user.lastLogin.getTime() + (Number(process.env.LOGIN_TIME) * 1000)) > Date.now())){
                    newTime = undefined;
        }
        await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({ lastLogin: newTime })
            .where("cod_user = :codUser", { codUser })
            .execute();
        return newTime === undefined ? false : true;
    }
}