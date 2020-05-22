import { getManager, getConnection } from "typeorm";
import ProfesionalExperience from '../model/prof_exp.model';

export default class ProfesionalExperienceDao {
    constructor() {

    }

    public static async createProfExp(profExp: ProfesionalExperience): Promise<ProfesionalExperience> {
        const newProfExp = getManager().create(ProfesionalExperience, profExp);
        await getManager().save(newProfExp);
        return newProfExp;
    }

    public static async getProfExp(codProfExp: number): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        const profExp = await profExpRepo.findOne(codProfExp);
        return profExp;
    }

    public static async removeProfExp(profExpToRemove: ProfesionalExperience): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        return await profExpRepo.remove(profExpToRemove);
    }

    public static async updateProfCat(profExpToUpdate: ProfesionalExperience): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        return await profExpRepo.save(profExpToUpdate);
    }
}