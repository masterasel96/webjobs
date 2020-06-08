import { getManager, getConnection } from "typeorm";
import User from '../model/user.model';
import md5 from "md5";
import { isNull } from "lodash";
import ProfesionalExperience from "../model/prof_exp.model";

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
            throw new Error(`Este usuario no existe...`);
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

    public static async getUsersByCatLoc(catName: string, location: string): Promise<User[]> {
        const users = getConnection().getRepository(User)
            .createQueryBuilder('user');
        if(catName){
            users.innerJoin("user.experience", 'profesional_experience')
                .innerJoin("profesional_experience.categories", 'profesional_category')
                .where("profesional_category.name = :catName AND user.region = :location", { catName, location })
        }else{
            users.where("user.region = :location", { location })
        }
        return await users.getMany();
    }
}