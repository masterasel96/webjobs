import { Router, Response, Request } from "express";
import { isEmpty } from "lodash";
import ProfCatService from "../services/prof_cat.service";
import Guard from "../core/guard.core";

export default class ProfCatRoute {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/create', this.setProfCat);
        this.router.post('/', this.getAllProfCat);
    }

    private async setProfCat(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const name: string = req.body.name;
            const description: string = req.body.description;
            if (isEmpty(name) || isEmpty(description)) {
                throw new Error(`Datos incorrectos o insuficientes...`);
            }
            const profesionalCategory = await ProfCatService.setProfCat(name, description);
            if (isEmpty(profesionalCategory)) {
                throw new Error(`Error creando categoria profesional...`);
            }
            res.status(200).json({
                code: 200,
                data: { profesionalCategory },
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

    private async getAllProfCat(req: Request, res: Response) {
        try {
            if (!Guard.bauth(req, res)) {
                return;
            };
            const profesionalCategory = await ProfCatService.getAllProfCat();
            res.status(200).json({
                code: 200,
                data: { profesionalCategory },
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
}