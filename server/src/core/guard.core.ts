import authv, { BasicAuthResult } from "basic-auth";
import { Request, Response } from "express";
export default class Guard {
    constructor(){

    }

    public static bauth(req: Request, res: Response): boolean {
        const user: BasicAuthResult | undefined = authv(req);
        if (user === undefined
            || process.env.BASIC_AUTH_USER !== user.name
            || process.env.BASIC_AUTH_PASSWD !== user.pass
        ) {
            res.status(401).json({
                code: 401,
                validation: 'Unauthorized...',
                status: false
            });
            return false;
        }
        return true;
    }

}