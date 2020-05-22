import { Router, Request, Response } from 'express';
import { IProfExpRequest } from "../interface/request.interface";
import { isNull, isEmpty } from 'lodash';
import ProfExpService from '../services/prof_exp.service';

export default class ProfExpRoute {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/create', this.setProfExp.bind(this));
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

    private validateProfExp(profExp: IProfExpRequest): boolean {
        return !(isNull(profExp.codUser) || isNull(profExp.codCategory) || isNull(profExp.endDate)
            || isNull(profExp.startDate) || isEmpty(profExp.position));
    }
}