import { getManager, getConnection } from "typeorm";
import ProfesionalExperience from '../model/prof_exp.model';
import UserService from '../services/user.service';
import { isArray } from "lodash";

export default class ProfesionalExperienceDao {
    constructor() {

    }

    public static async createProfExp(profExp: ProfesionalExperience): Promise<ProfesionalExperience> {
        console.log(profExp);
        const newProfExp = getManager().create(ProfesionalExperience, profExp);
        await getManager().save(newProfExp);
        return newProfExp;
    }

    public static async getProfExp(codProfExp: number): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        const profExp = await profExpRepo.findOne(codProfExp);
        return profExp;
    }

    public static async getProfExpByUser(codUser: number): Promise<ProfesionalExperience[] | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        const user = await UserService.getUser(codUser);
        if(user === undefined || isArray(user) ){
            return undefined;
        }
        return await profExpRepo.find({ where: [{ user }], relations: ['category'] });
    }

    public static async removeProfExp(codProfExp: number): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        const profExpRemove = await profExpRepo.findOne(codProfExp);
        return profExpRemove === undefined ? undefined : await profExpRepo.remove(profExpRemove);
    }

    public static async updateProfExp(profExpToUpdate: ProfesionalExperience): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        return await profExpRepo.save(profExpToUpdate);
    }
}