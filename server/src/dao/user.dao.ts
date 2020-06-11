import { getManager, getConnection, UpdateResult } from "typeorm";
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

    public static async getUserByToken(token: string): Promise<User | undefined> {
        const userRepo = getConnection().getRepository(User);
        return await userRepo.findOne(token);
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

    public static async checkLogin(email: string, pass: string): Promise<User[] | null> {
        const userCount = await getConnection().getRepository(User)
            .createQueryBuilder('user')
            .where("user.email = :email AND user.password = :pass", { email, pass: md5(pass) })
            .getMany();
        if(userCount.length > 0){
            await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({ lastLogin: new Date() })
                .where("email = :email", { email })
                .execute();
            return userCount;
        }
        return null;
    }

    public static async checkLastLogin(token: string): Promise<boolean> {
        const user = await getConnection().getRepository(User).findOne({
            where: {
                token
            }
        });
        if(user === undefined){
            //throw new Error(`Este usuario no se ha logeado...`);
            return false;
        }
        let newTime: Date | undefined = new Date();
        /*if (process.env.LOGIN_TIME !== undefined
                && !isNull(user.lastLogin) && ((user.lastLogin.getTime() + (Number(process.env.LOGIN_TIME) * 1000)) > Date.now())){
                    newTime = undefined;
        }*/
        await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({ lastLogin: newTime })
            .where("token = :token", { token })
            .execute();
        return true;
    }

    public static async getUsersByCatLoc(catName: string, location: string, noUser?: string): Promise<User[]> {
        const users = getConnection().getRepository(User)
            .createQueryBuilder('user');
        let where = "";
        let whereKeys = {};
        if(catName){
            if (catName !== 'all'){
                users.innerJoin("user.experience", 'profesional_experience')
                    .innerJoin("profesional_experience.category", 'profesional_category');
                where = "profesional_category.name = :catName AND user.city = :location AND user.codUser != :noUser AND user.offer = true";
                whereKeys = { catName, location, noUser };
            }else{
                where = "user.city = :location AND user.codUser != :noUser AND user.offer = true";
                whereKeys = { location, noUser };
            }
        }else{
            where = "user.region = :location AND user.codUser != :noUser AND user.offer = true";
            whereKeys = { location, noUser };
        }
        users.where(where, whereKeys);
        return await users.getMany();
    }
}