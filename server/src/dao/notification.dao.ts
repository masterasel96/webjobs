import { getManager, getConnection } from "typeorm";
import Notification from '../model/notification.model';
import UserService from "../services/user.service";
import { isArray } from "lodash";

export default class NotificationDao {
    constructor() {

    }

    public static async createNotification(notification: Notification): Promise<Notification> {
        const newNotification = getManager().create(Notification, notification);
        await getManager().save(newNotification);
        return newNotification;
    }

    public static async getNotification(codNotification: number): Promise<Notification | undefined> {
        const notificationRepo = getConnection().getRepository(Notification);
        const notification = await notificationRepo.findOne(codNotification);
        return notification;
    }

    public static async removenotification(notificationToRemove: Notification): Promise<Notification | undefined> {
        const notificationRepo = getConnection().getRepository(Notification);
        return await notificationRepo.remove(notificationToRemove);
    }

    public static async updatenotification(notificationToUpdate: Notification): Promise<Notification | undefined> {
        const notificationRepo = getConnection().getRepository(Notification);
        return await notificationRepo.save(notificationToUpdate);
    }

    public static async getNotificationsByUser(codUser: number): Promise<Notification[] | undefined> {
        const notificationRepo = getConnection().getRepository(Notification);
        const user = await UserService.getUser(codUser);
        if (user === undefined || isArray(user)) {
            throw new Error(`Este usuario no existe...`);
        }
        return await notificationRepo.find({ where: [{ user }], relations: ['user', 'indirectUser'] });
    }

    public static async checkNotifications(codUser: number): Promise<boolean> {
        const notificationCount = await getConnection().getRepository(Notification)
            .createQueryBuilder('notification')
            .where("notification.cod_user = :codUser AND notification.see = false", { codUser })
            .getCount();
        return notificationCount > 0 ? true : false;
    }

    public static async seeNotification(codNotification: number): Promise<boolean> {
        const updateResult = await getConnection()
            .createQueryBuilder()
            .update(Notification)
            .set({ see: true })
            .where("cod_notify = :codNotification", { codNotification })
            .execute();
        return updateResult.affected !== undefined && updateResult.affected > 0  ? true : false;
    }
}