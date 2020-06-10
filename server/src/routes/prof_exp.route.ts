import { Router, Request, Response } from 'express';
import { IProfExpRequest, IProfExpUpdateRequest } from "../interface/request.interface";
import { isNull, isEmpty } from 'lodash';
import ProfExpService from '../services/prof_exp.service';
import { IProfesionalExpUpdate } from '../interface/update.interface';
import Guard from '../core/guard.core';

export default class ProfExpRoute {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/', this.getUserProfExp);
        this.router.post('/create', this.setProfExp.bind(this));
        this.router.post('/remove', this.removeProfExp);
        this.router.post('/update', this.updateProfExp.bind(this));
    }

    private async setProfExp(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const profExpRequest = req.body as unknown as IProfExpRequest;
            console.log(profExpRequest);
            if (!this.validateProfExp(profExpRequest)) {
                throw new Error(`Datos incorrectos o insuficientes...`);
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

    private async removeProfExp(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const codProfExp = req.body.codProfExp;
            if (isNull(codProfExp)) {
                throw new Error(`Datos incorrectos o insuficientes...`);
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

    private async updateProfExp(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const data = req.body as IProfExpUpdateRequest;
            if (isEmpty(data.codProfExp) || isEmpty(data.newValues)) {
                throw new Error(`Datos incorrectos o insuficientes...`);
            }
            if (!this.validateUpdateProfExp(data.newValues)) {
                throw new Error(`Datos incorrectos o insuficientes...`);
            }
            const profExpUpdate = await ProfExpService.updateProfExp(data);
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

    private async getUserProfExp(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const codUser: number = req.body.codUser;
            if (codUser === undefined || isNull(codUser)) {
                throw new Error(`Datos insuficientes...`);
            }
            const profExp = await ProfExpService.getProfExpByUser(codUser);
            res.status(200).json({
                code: 200,
                data: { profExp },
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
        return !(isNull(profExp.codUser) || isNull(profExp.codCategory)
            || isNull(profExp.startDate) || isEmpty(profExp.position) || isEmpty(profExp.company));
    }

    private validateUpdateProfExp(profExp: IProfesionalExpUpdate): boolean {
        return !((profExp.category !== undefined && isEmpty(profExp.category)) ||
            (profExp.endDate !== undefined && isNull(profExp.endDate)) ||
            (profExp.startDate !== undefined && isNull(profExp.startDate)) ||
            (profExp.position !== undefined && isEmpty(profExp.position)) ||
            (profExp.company !== undefined && isEmpty(profExp.company)));
    }
}