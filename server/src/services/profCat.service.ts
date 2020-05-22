import ProfCat from "../model/prof_cat.model";
import ProfCatDao from "../dao/prof_cat.dao";

export default class ProfCatService {
    constructor() {

    }

    public static async setProfCat(name: string, description: string): Promise<ProfCat>{
        return await ProfCatDao.createProfCat(new ProfCat(name, description));
    }
}