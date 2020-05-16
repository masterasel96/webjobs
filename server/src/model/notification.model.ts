import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import User from './user.model';

@Entity()
export default class Notification {
    @PrimaryGeneratedColumn({ name: 'cod_notify' })
    public codNotify?: number;

    @ManyToOne(type => User, user => user.notifications)
    @JoinColumn({ name: "cod_user" })
    public user: User;

    @Column({ default: false })
    public see?: boolean;

    @Column()
    public message: string;

    @CreateDateColumn({ name: 'created_at', update: false })
    public createdDate?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updateDate?: Date;

    constructor(user: User, message: string){
        this.user = user,
        this.message = message
    }

}