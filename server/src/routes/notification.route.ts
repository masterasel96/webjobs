import { Router, Request, Response } from 'express';
import { INotificationRequest } from '../interface/request.interface';
import { isEmpty, isNull } from 'lodash';
import NotificationService from '../services/notification.service';
import Notification from '../model/notification.model';
import Guard from '../core/guard.core';

export default class NotificationRoute {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/', this.getNotificationsByUser);
        this.router.post('/create', this.createNotification);
        this.router.post('/checkNew', this.checkNewNotifications);
        this.router.post('/see', this.seeNotification);
    }

    private async createNotification(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const notification = req.body as INotificationRequest;
            if (isEmpty(notification.codIndirectUser) || isEmpty(notification.codUser) ||
                isEmpty(notification.message)) {
                throw new Error(`Datos insuficientes...`);
            }
            const newNotification: Notification = await NotificationService.createNotification(notification);
            if (isEmpty(newNotification)) {
                throw new Error(`Error creando nueva notificacion...`);
            }
            res.status(200).json({
                code: 200,
                data: { newNotification },
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

    private async getNotificationsByUser(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const codUser = req.body.codUser;
            if (isEmpty(codUser)) {
                throw new Error(`Datos insuficientes...`);
            }
            const notifications: Notification[] = await NotificationService.getNotificationsByUser(codUser);
            res.status(200).json({
                code: 200,
                data: { notifications },
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

    private async checkNewNotifications(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const codUser = req.body.codUser;
            if (isEmpty(codUser)) {
                throw new Error(`Datos insuficientes...`);
            }
            const newNotifications: boolean = await NotificationService.checkNewNotifications(codUser);
            res.status(200).json({
                code: 200,
                data: { newNotifications },
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

    private async seeNotification(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const codNotification = req.body.codNotification;
            if (isNull(codNotification)) {
                throw new Error(`Datos insuficientes...`);
            }
            const see: boolean = await NotificationService.seeNotification(codNotification);
            res.status(200).json({
                code: 200,
                data: { see },
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