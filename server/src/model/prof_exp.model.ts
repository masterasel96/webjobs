import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import User from './user.model';
import ProfesionalCategory from "./prof_cat.model";

@Entity()
export default class ProfesionalExperience {
    @PrimaryGeneratedColumn({ name: 'cod_experience' })
    public codExperience?: number;

    @ManyToOne(type => User, user => user.experience)
    @JoinColumn({ name: "cod_user" })
    public user: User;

    @Column()
    public position: string;

    @Column({ name: "start_date" })
    public startDate: Date;

    @Column({ name: "end_date" })
    public endDate: Date;

    @CreateDateColumn({ name: 'created_at', update: false })
    public createdDate?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updateDate?: Date;

    @ManyToMany(type => ProfesionalCategory, cat => cat.experiences)
    @JoinTable({name: 'tiene_cat'})
    categories?: ProfesionalCategory[];

    constructor(user: User, position: string, startDate: Date, endDate: Date) {
        this.user = user,
        this.position = position,
        this.startDate = startDate,
        this.endDate = endDate
    }
}