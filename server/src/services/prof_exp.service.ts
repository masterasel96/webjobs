import ProfExpDao from '../dao/prof_exp.dao';
import ProfExp from '../model/prof_exp.model';
import UserDao from '../dao/user.dao';
import ProfCatService from './prof_cat.service';
import User from '../model/user.model';
import ProfCat from '../model/prof_cat.model';
import { isArray } from 'lodash';
import { IProfExpRequest, IProfExpUpdateRequest } from '../interface/request.interface';

export default class ProfExpService {
    constructor() {

    }

    public static async setProfExp(profExp: IProfExpRequest): Promise<ProfExp> {
        const user: User | undefined | User[] = await UserDao.getUser(profExp.codUser);
        const profCat: ProfCat = await ProfCatService.getProfCat(profExp.codCategory);
        if(user === undefined || isArray(user)){
            throw new Error(`Error getting user or category data...`);
        }
        return await ProfExpDao.createProfExp(new ProfExp(user, profCat, profExp.position, profExp.company, 
            new Date(profExp.startDate), new Date(profExp.endDate)));
    }

    public static async removeProfExp(codProfExp: number): Promise<ProfExp> {
        const profExpRemove: ProfExp | undefined = await ProfExpDao.removeProfExp(codProfExp)
        if(profExpRemove === undefined){
            throw new Error(`Error deleting profesional experience...`);
        }
        return profExpRemove;
    }

    public static async updateProfExp(updateData: IProfExpUpdateRequest): Promise<ProfExp> {
        const oldProfExp = await ProfExpDao.getProfExp(updateData.codProfExp);
        if (oldProfExp === undefined) {
            throw new Error(`This profesional experience doesn´t exists...`);
        }
        const profExpAttr = ProfExp.describe();
        Object.keys(updateData.newValues).forEach(val => {
            if(!profExpAttr.includes(val)){
                throw new Error(`Error in update values...`);
            }
        });
        if (Object.keys(updateData.newValues).includes('category')){
            (updateData.newValues as unknown as { category: number | object }).category = await ProfCatService.getProfCat(
                (updateData.newValues as unknown as  { category: number }).category
            );
        }
        const newProfExp = {
            ...oldProfExp,
            ...updateData.newValues
        }
        const updateProfExp = await ProfExpDao.updateProfExp(newProfExp as ProfExp);
        if(updateProfExp === undefined){
            throw new Error(`Error updating profesional experience...`);
        }
        return updateProfExp;
    }

    public static async getProfCatByUser(codUser: number): Promise<ProfExp[]> {
        const profExp = await ProfExpDao.getProfExpByUser(codUser);
        if(profExp === undefined){
            throw new Error(`Error getting profesional experiences...`);
        }
        return profExp;
    }


}