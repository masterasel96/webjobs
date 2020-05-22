import { Router, Request, Response } from 'express';
import UserService from '../services/user.service';
import { isEmpty, isNull, isBoolean } from "lodash";
import User from '../model/user.model';
import * as EmailValidator from 'email-validator';
import { SexType } from '../interface/db.interface';

export default class UserRoute {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/', this.getUsers);
        this.router.post('/create', this.createUser.bind(this));
        this.router.post('/login', this.checkLogin);
        this.router.post('/checkLogin', this.checkLastLogin);
        this.router.post('/byCatLoc', this.getUsersByCatLoc)
    }

    private async getUsers(req: Request, res: Response) {
        try {
            const codUser = req.body.codUser;
            const users = await UserService.getUser(isEmpty(codUser) || isNull(codUser) ? 0 : codUser);
            res.status(200).json({
                code: 200,
                data: { users },
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

    private async createUser(req: Request, res: Response) {
        try {
            const user = req.body as User;
            if(isEmpty(user)){
                throw new Error(`Insufficient data...`);
            }
            this.validateUser(user);
            const newUser = await UserService.createUser(user);
            if(isEmpty(newUser)){
                throw new Error(`Error creating user...`);
            }
            res.status(200).json({
                code: 200,
                data: { newUser },
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

    private async checkLogin(req: Request, res: Response) {
        try {
            const email: string = req.body.email;
            const password: string = req.body.password;
            if(isEmpty(email) || isEmpty(password)){
                throw new Error(`Insufficient data...`);
            }
            if(!await UserService.checkLogin(email, password)){
                throw new Error(`Invalid email or password...`);
            }
            res.status(200).json({
                code: 200,
                data: { login: true },
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

    private async checkLastLogin(req: Request, res: Response) {
        try {
            const codUser: number = req.body.codUser;
            if (isNull(codUser)) {
                throw new Error(`Insufficient data...`);
            }
            const keepLogin = await UserService.checkLastLogin(codUser);
            res.status(200).json({
                code: 200,
                data: { keepLogin },
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

    private async getUsersByCatLoc(req: Request, res: Response) {
        try {
            const category: string = req.body.category;
            const location: string = req.body.location;
            if(isEmpty(category) || isEmpty(location)){
                throw new Error(`Insufficient data...`);
            }
            const users: User[] = await UserService.getUserByCatLoc(category, location);
            res.status(200).json({
                code: 200,
                data: { users },
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



    private validateUser(user: User) {
        if(isEmpty(user) || isEmpty(user.userName) || isEmpty(user.lastName) || isEmpty(user.email) ||
            isEmpty(user.dni) || isEmpty(user.telf || isEmpty(user.age) || isEmpty(user.sex) 
            || isEmpty(user.password) || isEmpty(user.postalCode) || isEmpty(user.city) 
            || isEmpty(user.region) || isEmpty(user.address) || !isBoolean(user.offer))){
            throw new Error(`Insufficient or incorrect data...`);
        }

        if (!EmailValidator.validate(user.email)){
            throw new Error(`Incorrect email format...`);
        }

        if(user.dni.length != 9 || !this.validateNif(user.dni)) {
            throw new Error(`Incorrect NIF format...`);
        }
        
        if (user.telf.length != 9 || !/^\d+$/.test(user.telf)) {
            throw new Error(`Incorrect telephone format...`);
        }

        if (user.age < 18 || user.age > 100) {
            throw new Error(`Incorrect age...`);
        }

        if(!Object.values(SexType).includes(user.sex as SexType)){
            throw new Error(`Incorrect sex...`);
        }

        if( user.password.length < 6){
            throw new Error(`Incorrect password, min length 6 characters...`);
        }

        if (user.postalCode.toString().length != 5 ){
            throw new Error(`Incorrect postal code...`);
        }

    }

    private validateNif(nif: string): boolean{
        var numero: number;
        var letr: string;
        var letra: string;
        const expresion_regular_dni: RegExp = /^\d{8}[a-zA-Z]$/;
        if (expresion_regular_dni.test(nif)) {
            numero = Number(nif.substr(0, nif.length - 1));
            letr = nif.substr(nif.length - 1, 1);
                numero = numero % 23;
                letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
                letra = letra.substring(numero, numero + 1);
                if (letra != letr.toUpperCase()) {
                    return false;
                }
                return true;
        }
        return false;
    }
}