import { getManager, getConnection } from "typeorm";
import ProfesionalCategory from '../model/prof_cat.model';

export default class ProfesionalCategoryDao {
    constructor() {

    }

    public static async createProfCat(profCat: ProfesionalCategory): Promise<ProfesionalCategory> {
        const newProfCat = getManager().create(ProfesionalCategory, profCat);
        await getManager().save(newProfCat);
        return newProfCat;
    }

    public static async getProfCat(codProfCat: number): Promise<ProfesionalCategory | undefined> {
        const profCatRepo = getConnection().getRepository(ProfesionalCategory);
        const profCat = await profCatRepo.findOne(codProfCat);
        return profCat;
    }

    public static async removeProfCat(profCatToRemove: ProfesionalCategory): Promise<ProfesionalCategory | undefined> {
        const profCatRepo = getConnection().getRepository(ProfesionalCategory);
        return await profCatRepo.remove(profCatToRemove);
    }

    public static async updateProfCat(profCatToUpdate: ProfesionalCategory): Promise<ProfesionalCategory | undefined> {
        const profCatRepo = getConnection().getRepository(ProfesionalCategory);
        return await profCatRepo.save(profCatToUpdate);
    }
}