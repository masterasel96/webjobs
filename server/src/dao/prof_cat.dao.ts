import { getManager, getConnection } from "typeorm";
import ProfesionalCategory from '../model/prof_cat.model';

export default class ProfesionalCategoryDao {
    constructor() {

    }

    public async createProfCat(profCat: ProfesionalCategory): Promise<ProfesionalCategory> {
        const newProfCat = getManager().create(ProfesionalCategory, profCat);
        await getManager().save(newProfCat);
        return newProfCat;
    }

    public async getProfCat(codProfCat: number): Promise<ProfesionalCategory | undefined> {
        const profCatRepo = getConnection().getRepository(ProfesionalCategory);
        const profCat = await profCatRepo.findOne(codProfCat);
        return profCat;
    }

    public async removeProfCat(profCatToRemove: ProfesionalCategory): Promise<ProfesionalCategory | undefined> {
        const profCatRepo = getConnection().getRepository(ProfesionalCategory);
        return await profCatRepo.remove(profCatToRemove);
    }

    public async updateProfCat(profCatToUpdate: ProfesionalCategory): Promise<ProfesionalCategory | undefined> {
        const profCatRepo = getConnection().getRepository(ProfesionalCategory);
        return await profCatRepo.save(profCatToUpdate);
    }
}