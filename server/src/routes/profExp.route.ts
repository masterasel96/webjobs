import { Router, Request, Response } from 'express';
import { IProfExpRequest, IProfExpUpdateRequest } from "../interface/request.interface";
import { isNull, isEmpty } from 'lodash';
import ProfExpService from '../services/prof_exp.service';

export default class ProfExpRoute {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/create', this.setProfExp.bind(this));
        this.router.post('/remove', this.removeProfExp);
        this.router.post('/update', this.updateProfExp);
    }

    private async setProfExp(req: Request, res: Response){
        try {
            const profExpRequest = req.body as unknown as IProfExpRequest;
            if (!this.validateProfExp(profExpRequest)){
                throw new Error(`Insufficient or incorrect data...`);
            }
            const profesionalExperience = await ProfExpService.setProfExp(profExpRequest);
            res.status(200).json({
                code: 200,
                data: { profesionalExperience },
                status: true
            });
        } catch (error) {
            const err: Error = error;
            res.status(400).json({
                code: 400,
                data: { error: err.message },
                status: false
            });
        }
    }

    private async removeProfExp(req: Request, res: Response){
        try {
            const codProfExp = req.body.codProfExp;
            if(isEmpty(codProfExp)){
                throw new Error(`Insufficient or incorrect data...`);
            }
            const profExpRemove = await ProfExpService.removeProfExp(codProfExp);
            res.status(200).json({
                code: 200,
                data: { profExpRemove },
                status: true
            });
        } catch (error) {
            const err: Error = error;
            res.status(400).json({
                code: 400,
                data: { error: err.message },
                status: false
            });
        }
    }

    private async updateProfExp(req: Request, res: Response){
        try {
            const data = req.body as IProfExpUpdateRequest;
            if(isEmpty(data.codProfExp) || isEmpty(data.newValues)){
                throw new Error(`Insufficient or incorrect data...`);
            }
            const profExpUpdate = await ProfExpService.updateProfExp(data.codProfExp, data.newValues);
            res.status(200).json({
                code: 200,
                data: { profExpUpdate },
                status: true
            });
        } catch (error) {
            const err: Error = error;
            res.status(400).json({
                code: 400,
                data: { error: err.message },
                status: false
            });
        }
    }

    private validateProfExp(profExp: IProfExpRequest): boolean {
        return !(isNull(profExp.codUser) || isNull(profExp.codCategory) || isNull(profExp.endDate)
            || isNull(profExp.startDate) || isEmpty(profExp.position) || isEmpty(profExp.company));
    }
}