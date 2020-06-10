import { Router, Request, Response } from 'express';
import UserService from '../services/user.service';
import { isEmpty, isNull, isBoolean } from "lodash";
import User from '../model/user.model';
import * as EmailValidator from 'email-validator';
import { SexType } from '../interface/db.interface';
import { IUserUpdateRequest } from '../interface/request.interface';
import { IUserUpdate } from '../interface/update.interface';
import Guard from '../core/guard.core';

export default class UserRoute {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/', this.getUsers);
        this.router.post('/byToken', this.getUserByToken);
        this.router.post('/create', this.createUser.bind(this));
        this.router.put('/update', this.updateUser.bind(this));
        this.router.post('/login', this.checkLogin);
        this.router.post('/checkLogin', this.checkLastLogin);
        this.router.post('/byCatLoc', this.getUsersByCatLoc);
    }

    private async getUsers(req: Request, res: Response) {
        try {
            if (!Guard.bauth(req, res)) {
                return;
            };
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

    private async getUserByToken(req: Request, res: Response) {
        try {
            if (!Guard.bauth(req, res)) {
                return;
            };
            const token = req.body.token;
            if (isEmpty(token)) {
                throw new Error(`Datos insuficientes...`);
            }
            const user = await UserService.getUserByToken(token);
            res.status(200).json({
                code: 200,
                data: { user },
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
            if(!Guard.bauth(req, res)){
                return;
            };
            const user = req.body as User;
            if (isEmpty(user)) {
                throw new Error(`Datos insuficientes...`);
            }
            this.validateUser(user);
            const newUser = await UserService.createUser(user);
            if (isEmpty(newUser)) {
                throw new Error(`Error creando usuario...`);
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

    private async updateUser(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const updateReq = req.body as IUserUpdateRequest;
            if (isNull(updateReq.codUser) || isEmpty(updateReq.newValues)) {
                throw new Error(`Datos insuficientes...`);
            }
            this.validateUpdateUser(updateReq.newValues);
            const updatedUser = await UserService.updateUser(updateReq);
            res.status(200).json({
                code: 200,
                data: { updatedUser },
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
            if(!Guard.bauth(req, res)){
                return;
            };
            const email: string = req.body.email;
            const password: string = req.body.password;
            if (isEmpty(email) || isEmpty(password)) {
                throw new Error(`Datos insuficientes...`);
            }
            const login = await UserService.checkLogin(email, password);
            if (!login) {
                throw new Error(`Email o contraseña invalidos...`);
            }
            res.status(200).json({
                code: 200,
                data: { login },
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
            if(!Guard.bauth(req, res)){
                return;
            };
            const token: string = req.body.token;
            if (isEmpty(token)) {
                throw new Error(`Datos insuficientes...`);
            }
            const keepLogin = await UserService.checkLastLogin(token);
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
            if(!Guard.bauth(req, res)){
                return;
            };
            const category: string = req.body.category;
            const location: string = req.body.location;
            const noUser: string = req.body.noUser;
            if (isEmpty(location)) {
                throw new Error(`Datos insuficientes...`);
            }
            const users: User[] = await UserService.getUserByCatLoc(category, location, noUser);
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
        if ( isEmpty(user) || isEmpty(user.userName) || isEmpty(user.lastName) || isEmpty(user.email) ||
                isEmpty(user.dni) || isNull(user.telf) || isNull(user.age) || isEmpty(user.sex)
                || isEmpty(user.password) || isNull(user.postalCode) || isEmpty(user.city)
                || isEmpty(user.region) || isEmpty(user.address) || !isBoolean(user.offer)) {
            throw new Error(`Datos incorrectos o insuficientes...`);
        }

        if (!EmailValidator.validate(user.email)) {
            throw new Error(`Formato de email incorrecto...`);
        }

        if (user.dni.length != 9 || !this.validateNif(user.dni)) {
            throw new Error(`Formato de NIF incorrecto...`);
        }

        if (user.telf.length != 9 || !/^\d+$/.test(user.telf)) {
            throw new Error(`Formato del telefono incorrecto...`);
        }

        if (user.age < 18 || user.age > 100) {
            throw new Error(`Edad incorrrecta...`);
        }

        if (!Object.values(SexType).includes(user.sex as SexType)) {
            throw new Error(`Sexo incorrecto...`);
        }

        if (user.password.length < 6 || user.password.length > 12) {
            throw new Error(`Contraseña incorrecta, minimo 6 caracteres y maximo 12...`);
        }

        if (user.postalCode.toString().length != 5) {
            throw new Error(`Codigo postal incorrecto...`);
        }

    }

    private validateUpdateUser(user: IUserUpdate) {
        if (user.email !== undefined && !EmailValidator.validate(user.email)) {
            throw new Error(`Formato de email incorrecto...`);
        }

        if (user.dni !== undefined && (user.dni.length != 9 || !this.validateNif(user.dni))) {
            throw new Error(`Formato de NIF incorrecto...`);
        }

        if (user.telf !== undefined && (user.telf.length != 9 || !/^\d+$/.test(user.telf))) {
            throw new Error(`Formato de telefono incorrecto...`);
        }

        if (user.age !== undefined && (user.age < 18 || user.age > 100)) {
            throw new Error(`Edad incorrecta...`);
        }

        if (user.sex !== undefined && !Object.values(SexType).includes(user.sex as SexType)) {
            throw new Error(`Sexo incorrecto...`);
        }

        if (user.password !== undefined && (user.password.length < 6 || user.password.length > 12)) {
            throw new Error(`Contraseña incorrecta, minimo 6 caracteres y maximo 12 caracteres...`);
        }

        if (user.postalCode !== undefined && user.postalCode.toString().length != 5) {
            throw new Error(`Codigo postal incorrecto...`);
        }
    }

    private validateNif(nif: string): boolean {
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