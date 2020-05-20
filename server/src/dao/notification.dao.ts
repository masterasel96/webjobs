import { getManager, getConnection } from "typeorm";
import Notification from '../model/notification.model';

export default class NotificationDao {
    constructor() {

    }

    public async createNotification(notification: Notification): Promise<Notification> {
        const newNotification = getManager().create(Notification, notification);
        await getManager().save(newNotification);
        return newNotification;
    }

    public async getNotification(codNotification: number): Promise<Notification | undefined> {
        const notificationRepo = getConnection().getRepository(Notification);
        const notification = await notificationRepo.findOne(codNotification);
        return notification;
    }

    public async removenotification(notificationToRemove: Notification): Promise<Notification | undefined> {
        const notificationRepo = getConnection().getRepository(Notification);
        return await notificationRepo.remove(notificationToRemove);
    }

    public async updatenotification(notificationToUpdate: Notification): Promise<Notification | undefined> {
        const notificationRepo = getConnection().getRepository(Notification);
        return await notificationRepo.save(notificationToUpdate);
    }
}