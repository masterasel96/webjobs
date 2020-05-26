import { Router, Response, Request } from "express";
import { isEmpty } from "lodash";
import ProfCatService from "../services/prof_cat.service";

export default class ProfCatRoute{

    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/create', this.setProfCat);
    }

    private async setProfCat(req: Request, res: Response){
        try {
            const name: string = req.body.name;
            const description: string = req.body.description;
            if(isEmpty(name) || isEmpty(description)){
                throw new Error(`Insufficient or incorrect data...`);
            }
            const profesionalCategory = await ProfCatService.setProfCat(name, description);
            if(isEmpty(profesionalCategory)){
                throw new Error(`Error creating profesional category...`);
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
}