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

    @ManyToOne(type => ProfesionalCategory, cat => cat.experiences)
    @JoinColumn({ name: "cod_category" })
    public category: ProfesionalCategory;

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

    constructor(user: User, category: ProfesionalCategory, position: string, startDate: Date, endDate: Date) {
        this.user = user,
        this.category = category,
        this.position = position,
        this.startDate = startDate,
        this.endDate = endDate
    }
}