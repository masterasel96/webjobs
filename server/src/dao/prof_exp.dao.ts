import { getManager, getConnection } from "typeorm";
import ProfesionalExperience from '../model/prof_exp.model';

export default class ProfesionalExperienceDao {
    constructor() {

    }

    public async createProfCat(profExp: ProfesionalExperience): Promise<ProfesionalExperience> {
        const newProfExp = getManager().create(ProfesionalExperience, profExp);
        await getManager().save(newProfExp);
        return newProfExp;
    }

    public async getProfExp(codProfExp: number): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        const profExp = await profExpRepo.findOne(codProfExp);
        return profExp;
    }

    public async removeProfExp(profExpToRemove: ProfesionalExperience): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        return await profExpRepo.remove(profExpToRemove);
    }

    public async updateProfCat(profExpToUpdate: ProfesionalExperience): Promise<ProfesionalExperience | undefined> {
        const profExpRepo = getConnection().getRepository(ProfesionalExperience);
        return await profExpRepo.save(profExpToUpdate);
    }
}