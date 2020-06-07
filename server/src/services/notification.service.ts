import { INotificationRequest } from "../interface/request.interface";
import User from "../model/user.model";
import UserDao from "../dao/user.dao";
import NotificationDao from "../dao/notification.dao";
import Notification from '../model/notification.model';
import { isArray } from "lodash";

export default class NotificationService {
    constructor(){

    }

    public static async createNotification(notificationRequest: INotificationRequest): Promise<Notification> {
        const user: User | undefined | User[] = await UserDao.getUser(notificationRequest.codUser); 
        const indirectUser: User | undefined | User[] = await UserDao.getUser(notificationRequest.codIndirectUser); 
        if (user === undefined || isArray(user) || indirectUser === undefined || isArray(indirectUser)) {
            throw new Error(`Error obteniendo el usuario...`);
        }
        return await NotificationDao.createNotification(new Notification(user, indirectUser, notificationRequest.message));
    }

    public static async getNotificationsByUser(codUser: number): Promise<Notification[]>{
        const notifications = await NotificationDao.getNotificationsByUser(codUser);
        if(notifications === undefined){
            throw new Error(`Error obteniendo las notificaciones...`);
        }
        return notifications;
    }

    public static async checkNewNotifications(codUser: number): Promise<boolean> {
        return await NotificationDao.checkNotifications(codUser);
    }

    public static async seeNotification(codNotification: number): Promise<boolean> {
        return await NotificationDao.seeNotification(codNotification);
    }
}