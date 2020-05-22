import ProfExpDao from '../dao/prof_exp.dao';
import ProfExp from '../model/prof_exp.model';
import UserDao from '../dao/user.dao';
import ProfCatDao from '../dao/prof_cat.dao';
import User from '../model/user.model';
import ProfCat from '../model/prof_cat.model';
import { isArray } from 'lodash';
import { IProfExpRequest } from '../interface/request.interface';

export default class ProfExpService {
    constructor() {

    }

    public static async setProfExp(profExp: IProfExpRequest): Promise<ProfExp> {
        const user: User | undefined | User[] = await UserDao.getUser(profExp.codUser);
        const profCat: ProfCat | undefined = await ProfCatDao.getProfCat(profExp.codCategory);
        if(user === undefined || isArray(user) || profCat === undefined){
            throw new Error(`Error getting user or category data...`);
        }
        return await ProfExpDao.createProfExp(new ProfExp(user, profCat, profExp.position, 
            new Date(profExp.startDate), new Date(profExp.endDate)));
    }


}