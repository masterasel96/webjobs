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
            throw new Error(`Error obteniendo los datos del usuario o la categoria...`);
        }
        return await ProfExpDao.createProfExp(new ProfExp(user, profCat, profExp.position, profExp.company, 
            new Date(profExp.startDate), profExp.endDate ? new Date(profExp.endDate) : undefined));
    }

    public static async removeProfExp(codProfExp: number): Promise<ProfExp> {
        const profExpRemove: ProfExp | undefined = await ProfExpDao.removeProfExp(codProfExp)
        if(profExpRemove === undefined){
            throw new Error(`Error borrando las experiencia profesional...`);
        }
        return profExpRemove;
    }

    public static async updateProfExp(updateData: IProfExpUpdateRequest): Promise<ProfExp> {
        const oldProfExp = await ProfExpDao.getProfExp(updateData.codProfExp);
        if (oldProfExp === undefined) {
            throw new Error(`Esta experiencia profesional no existe...`);
        }
        const profExpAttr = ProfExp.describe();
        Object.keys(updateData.newValues).forEach(val => {
            if(!profExpAttr.includes(val)){
                throw new Error(`Error en los valores de modificacion...`);
            }
        });
        if (Object.keys(updateData.newValues).includes('category')){
            (updateData.newValues as unknown as { category: number | object }).category = await ProfCatService.getProfCat(
                (updateData.newValues as unknown as  { category: number }).category
            );
        }
        if (Object.keys(updateData.newValues).includes('startDate')) {
            (updateData.newValues as unknown as { startDate: Date }).startDate = new Date(updateData.newValues.startDate as string );
        }
        if (Object.keys(updateData.newValues).includes('endDate')) {
            (updateData.newValues as unknown as { endDate: Date }).endDate = new Date(updateData.newValues.endDate as string);
        }
        const newProfExp = {
            ...oldProfExp,
            ...updateData.newValues
        }
        const updateProfExp = await ProfExpDao.updateProfExp(newProfExp as ProfExp);
        if(updateProfExp === undefined){
            throw new Error(`Error modificando la experiencia profesional...`);
        }
        return updateProfExp;
    }

    public static async getProfExpByUser(codUser: number): Promise<ProfExp[]> {
        const profExp = await ProfExpDao.getProfExpByUser(codUser);
        if(profExp === undefined){
            throw new Error(`Error obteniendo las experiencias profesionales..`);
        }
        return profExp;
    }


}