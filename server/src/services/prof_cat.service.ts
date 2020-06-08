import ProfCat from "../model/prof_cat.model";
import ProfCatDao from "../dao/prof_cat.dao";

export default class ProfCatService {
    constructor() {

    }

    public static async setProfCat(name: string, description: string): Promise<ProfCat>{
        return await ProfCatDao.createProfCat(new ProfCat(name, description));
    }

    public static async getProfCat(codCat: number): Promise<ProfCat> {
        const profCat = await ProfCatDao.getProfCat(codCat);
        if(profCat === undefined){
            throw new Error(`Error obteniendo las categorias profesionales...`);
        }
        return profCat;
    }

    public static async getAllProfCat(): Promise<ProfCat[]> {
        return await ProfCatDao.getAllProfCat();
    }
}